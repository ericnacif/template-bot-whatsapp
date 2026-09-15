#!/usr/bin/env python3
"""Gera os materiais visuais da demonstração fictícia de pousada."""

from pathlib import Path
import subprocess
import textwrap

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs"
FRAMES = OUTPUT / ".demo-frames"
WIDTH, HEIGHT = 900, 1100

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, size)


def wrapped_lines(text, width=42):
    lines = []
    for paragraph in text.split("\n"):
        lines.extend(textwrap.wrap(paragraph, width=width) or [""])
    return lines


def bubble_height(text):
    return 34 * len(wrapped_lines(text)) + 34


def draw_frame(messages, subtitle, path):
    image = Image.new("RGB", (WIDTH, HEIGHT), "#efeae2")
    draw = ImageDraw.Draw(image)

    draw.rectangle((0, 0, WIDTH, 112), fill="#075e54")
    draw.ellipse((34, 23, 98, 87), fill="#d8f3dc")
    draw.text((53, 37), "SV", font=font(20, True), fill="#075e54")
    draw.text((122, 24), "Pousada Serra Verde", font=font(28, True), fill="white")
    draw.text((122, 64), subtitle, font=font(18), fill="#d5eee9")

    draw.rounded_rectangle((24, HEIGHT - 82, WIDTH - 24, HEIGHT - 22), 28, fill="white")
    draw.text((54, HEIGHT - 65), "Digite uma mensagem", font=font(21), fill="#7a858a")

    available = HEIGHT - 230
    selected = []
    used = 0
    for sender, text in reversed(messages):
        height = bubble_height(text) + 18
        if selected and used + height > available:
            break
        selected.append((sender, text, height))
        used += height
    selected.reverse()

    y = 138
    for sender, text, total_height in selected:
        is_user = sender == "user"
        lines = wrapped_lines(text)
        max_line = max((draw.textlength(line, font=font(21)) for line in lines), default=200)
        bubble_width = min(700, max(300, int(max_line) + 54))
        x = WIDTH - bubble_width - 34 if is_user else 34
        fill = "#d9fdd3" if is_user else "#ffffff"
        draw.rounded_rectangle((x, y, x + bubble_width, y + total_height - 18), 18, fill=fill)

        text_y = y + 17
        for line in lines:
            draw.text((x + 24, text_y), line, font=font(21), fill="#182229")
            text_y += 34

        y += total_height

    image.save(path, quality=95)
    return image


def main():
    OUTPUT.mkdir(exist_ok=True)
    FRAMES.mkdir(exist_ok=True)

    menu = "POUSADA SERRA VERDE\n\n1 - Conhecer acomodações\n2 - Solicitar uma reserva\n3 - Localização e horários\n4 - Falar com um atendente"
    conversation = [("bot", menu)]
    stages = [(list(conversation), "Demonstração configurada por JSON", 4)]

    additions = [
        (("user", "2"), ("bot", "Perfeito! Para começar, qual é o seu nome?"), 4),
        (("user", "Eric Nacif"), ("bot", "Obrigado, Eric Nacif! Qual é a data de entrada?\nUse DD/MM/AAAA."), 4),
        (("user", "20/10/2026"), ("bot", "E qual será a data de saída?"), 4),
        (("user", "23/10/2026"), ("bot", "Para quantos hóspedes será a reserva?"), 3),
        (("user", "2"), ("bot", "SOLICITAÇÃO REGISTRADA\n\nEric Nacif\n20/10/2026 a 23/10/2026\n2 hóspedes"), 5),
        (("user", "falar com atendente"), ("bot", "ATENDIMENTO HUMANO SOLICITADO\nO bot ficará pausado por 60 minutos."), 4),
    ]

    subtitles = [
        "Captura do interesse",
        "Coleta estruturada",
        "Validação de datas",
        "Dados do atendimento",
        "Lead salvo com segurança",
        "Transferência para uma pessoa",
    ]

    for addition, subtitle in zip(additions, subtitles):
        user_message, bot_message, duration = addition
        conversation.extend([user_message, bot_message])
        stages.append((list(conversation), subtitle, duration))

    final_messages = [("bot", "Fluxos em JSON | Leads | Handoff | Redis | 52 testes")]
    stages.append((final_messages, "WhatsApp Bot Boilerplate v1.2.0", 4))

    images = []
    durations = []
    concat_lines = []
    for index, (messages, subtitle, duration) in enumerate(stages):
        frame_path = FRAMES / f"frame-{index:02d}.png"
        images.append(draw_frame(messages, subtitle, frame_path))
        durations.append(duration * 1000)
        concat_lines.extend([f"file '{frame_path.as_posix()}'", f"duration {duration}"])

    concat_lines.append(f"file '{(FRAMES / f'frame-{len(stages) - 1:02d}.png').as_posix()}'")
    concat_file = FRAMES / "frames.txt"
    concat_file.write_text("\n".join(concat_lines), encoding="utf-8")

    images[0].save(
        OUTPUT / "demo-pousada.gif",
        save_all=True,
        append_images=images[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )
    images[-2].save(OUTPUT / "demo-pousada.png", quality=95)

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_file),
            "-vf",
            "fps=24,format=yuv420p",
            "-c:v",
            "libx264",
            "-movflags",
            "+faststart",
            str(OUTPUT / "demo-pousada.mp4"),
        ],
        check=True,
        capture_output=True,
    )

    for frame in FRAMES.glob("*.png"):
        frame.unlink()
    concat_file.unlink()
    FRAMES.rmdir()


if __name__ == "__main__":
    main()
