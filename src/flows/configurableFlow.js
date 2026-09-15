const crypto = require('node:crypto');
const { MESSAGES } = require('../utils/messages');
const { sessionStore } = require('../utils/sessionStore');
const { leadStore } = require('../utils/leadStore');
const { renderTemplate } = require('../utils/template');
const { validateInput } = require('../utils/inputValidators');

function normalized(value) {
    return String(value || '')
        .trim()
        .toLowerCase();
}

async function enterNode({ nodeId, flow, message, session, sessions, leads, now }) {
    const node = flow.nodes[nodeId];
    const context = { lead: session.lead || {}, flow };

    if (node.type === 'handoff') {
        const minutes = node.durationMinutes || flow.handoff?.durationMinutes || 60;
        session.step = 'human_handoff';
        session.handoffUntil = now() + minutes * 60 * 1000;
        await sessions.set(message.from, session);
        return message.reply(renderTemplate(node.message, context));
    }

    if (node.type === 'save_lead') {
        const savedLead = {
            id: crypto.randomUUID(),
            flowId: flow.id,
            contactId: message.from,
            createdAt: new Date(now()).toISOString(),
            ...session.lead,
        };
        await leads.save(savedLead);
        session.step = node.next || 'idle';
        session.lead = {};
        await sessions.set(message.from, session);
        return message.reply(renderTemplate(node.message, { ...context, savedLead }));
    }

    session.step = node.type === 'message' ? node.next || 'idle' : nodeId;
    await sessions.set(message.from, session);
    return message.reply(renderTemplate(node.message, context));
}

async function configurableFlow(
    message,
    { flow, sessions = sessionStore, leads = leadStore, now = () => Date.now() },
) {
    const body = String(message.body || '').trim();
    const input = normalized(body);
    const session = await sessions.get(message.from);
    const triggerWords = flow.triggerWords || [];
    const handoffKeywords = flow.handoff?.keywords || [];

    if (triggerWords.map(normalized).includes(input)) {
        session.lead = {};
        delete session.handoffUntil;
        return enterNode({
            nodeId: flow.initialStep,
            flow,
            message,
            session,
            sessions,
            leads,
            now,
        });
    }

    if (handoffKeywords.map(normalized).includes(input) && flow.handoff?.node) {
        return enterNode({
            nodeId: flow.handoff.node,
            flow,
            message,
            session,
            sessions,
            leads,
            now,
        });
    }

    if (session.step === 'human_handoff') {
        if (session.handoffUntil && session.handoffUntil > now()) return undefined;
        session.step = 'idle';
        delete session.handoffUntil;
        await sessions.set(message.from, session);
    }

    const node = flow.nodes[session.step];
    if (!node) return message.reply(flow.messages?.noContext || MESSAGES.noContext);

    if (node.type === 'menu') {
        const option = node.options?.[body];
        if (!option) return message.reply(node.invalidMessage || MESSAGES.invalidOption);
        return enterNode({
            nodeId: option.next,
            flow,
            message,
            session,
            sessions,
            leads,
            now,
        });
    }

    if (node.type === 'input') {
        if (!validateInput(body, node.validator, { lead: session.lead || {} })) {
            return message.reply(node.invalidMessage || MESSAGES.invalidOption);
        }
        session.lead = { ...(session.lead || {}), [node.field]: body };
        return enterNode({
            nodeId: node.next,
            flow,
            message,
            session,
            sessions,
            leads,
            now,
        });
    }

    return message.reply(flow.messages?.noContext || MESSAGES.noContext);
}

module.exports = { configurableFlow, enterNode };
