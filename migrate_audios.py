import re
import os

# Mapping of Cloudinary links
CLOUDINARY_MAP = {
    # 1A
    "1A_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561648/TARGET_1_-1A_WORDS_AND_IDEAS_11.mp3_hirnnq.mp3",
    "1A_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561588/TARGET_1_-_1A_TARGET_SITUATION_11.MP3_sb8vm4.mp3",
    "1A_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561584/TARGET_1_-_1A_CROSS_CURRICULAR_ehuzys.mp4",

    # 1B
    "1B_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561585/TARGET_1_-_1B_WORDS_AND_IDEAS_avuca0.mp3",
    "1B_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561585/TARGET_1_-_1B_TARGET_SITUATION_19.MP3_ctuaxn.mp3",

    # 1C
    "1C_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561653/TARGET1_-_1C_TARGET_SITUATION_27.MP3_ozqzno.mp3",
    "1C_WORK": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561586/TARGET_1_-_1C_LANGUAGE_AT_WORK_wopnii.mp3",
    "1C_GUIDE_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561594/TARGET_1_-_1C_LANGUAGE_GUIDE_eqrrwj.mp4",
    "1C_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561586/TARGET_1_-_1C_CROSS_CURRICULAR_kg0fa7.mp4",

    # 2A
    "2A_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561594/TARGET_1_-_2A_TARGET_SITUATION_39.MP3_bew7kw.mp3",
    "2A_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561589/TARGET_1_-_2A_CROSS_CURRICULAR_cxa2o4.mp4",

    # 2B
    "2B_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561592/TARGET_1_-_2B_TARGET_SITUATION_uhm2uv.mp3",
    "2B_CROSS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561591/TARGET_1_-_2B_CROSS_CURRICULAR_rarc9r.mp3",

    # 2C
    "2C_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561609/TARGET_1_-_2C_TARGET_SITUATION_55.MP3_djv2f9.mp3",
    "2C_CROSS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561593/TARGET_1_-_2C_CROSS_CURRICULAR_zbzrxw.mp3",

    # 3A
    "3A_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561611/TARGET_1_-_3A_WORDS_AND_IDEAS_aol7wb.mp3",
    "3A_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561649/TARGET_1-_3A_TARGET_SITUATION_67.MP3_tlx3y9.mp3",
    "3A_CROSS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561610/TARGET_1_-_3A_CROSS_CURRICULAR_cjresh.mp3",

    # 3B
    "3B_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561614/TARGET_1_-_3B_WORDS_AND_IDEAS_adfmuv.mp3",
    "3B_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561620/TARGET_1_-_3B_TARGET_SITUATION_umkrn2.mp3",
    "3B_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561613/TARGET_1_-_3B_CROSS_CURRICULAR_fp7yoo.mp4",

    # 3C
    "3C_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561649/TARGET_1_-3C_TARGET_SITUATION_83.MP3_u8cgy4.mp3",
    "3C_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561615/TARGET_1_-_3C_CROSS_CURRICULAR_nfcbrh.mp4",

    # 3D
    "3D_STARTER": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561650/TARGET_1_-3D_STARTER_90.mp3_oicip3.mp3",

    # 4A
    "4A_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561618/TARGET_1_-_4A_WORDS_AND_IDEAS_mr4sym.mp3",
    "4A_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561617/TARGET_1_-_4A_TARGET_SITUATION_sgf6pg.mp3",
    "4A_CROSS_1": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561616/TARGET_1_-_4A_CROSS_CURRICULAR_ACTIVITY_1_m20akp.mp3",
    "4A_CROSS_2": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561616/TARGET_1_-_4A_CROSS_CURRICULAR_ACTIVITY_2_ljwkz1.mp3",

    # 4B
    "4B_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561622/TARGET_1_-_4B_WORDS_AND_IDEAS_102.MP3_jqe44f.mp3",
    "4B_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561621/TARGET_1_-_4B_TARGET_SITUATION_cm6rxl.mp3",
    "4B_WORK": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561620/TARGET_1_-_4B_LANGUAGE_AT_WORK_dfdlee.mp3",
    "4B_CROSS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561619/TARGET_1_-_4B_CROSS_CURRICULAR_cjbkzt.mp3",

    # 4C
    "4C_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561652/TARGET_1-4C_WORDS_AND_IDEAS_110.mp3_tihub1.mp3",
    "4C_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561623/TARGET_1_-_4C_TARGET_SITUATION_rwqfh4.mp3",

    # 5A
    "5A_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561625/TARGET_1_-_5A_WORDS_AND_IDEAS_wpgooo.mp3",
    "5A_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561625/TARGET_1_-_5A_TARGET_SITUATION_wqlztw.mp3",
    "5A_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561624/TARGET_1_-_5A_CROSS_CURRICULAR_ntqqxu.mp4",

    # 5B
    "5B_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561629/TARGET_1_-_5B_WORDS_AND_IDEAS_nroqsa.mp3",
    "5B_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561627/TARGET_1_-_5B_TARGET_SITUATION_nq3m9s.mp3",
    "5B_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561627/TARGET_1_-_5B_CROSS_CURRICULAR_zwqtag.mp4",

    # 5C
    "5C_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561629/TARGET_1_-_5C_WORDS_AND_IDEAS_jj21cd.mp3",
    "5C_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561654/TARGET1_-_5C_TARGET_SITUATION_139.MP3_o6aaza.mp3",

    # 6A
    "6A_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561630/TARGET_1_-_6A_WORDS_AND_IDEAS_151.MP3_mwdv04.mp3",
    "6A_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561631/TARGET_1_-_6A_TARGET_SITUATION_zr0c5z.mp3",
    "6A_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561631/TARGET_1_-_6A_CROSS_CURRICULAR_tn7a2n.mp4",

    # 6B
    "6B_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561634/TARGET_1_-_6B_WORDS_AND_IDEAS_jtqnuv.mp3",
    "6B_CROSS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561632/TARGET_1_-_6B_CROSS_CIRCULAR_161.MP3_iqhpyl.mp3",
    "6B_TARGET_PLACEHOLDER": "PENDENTE",

    # 6C
    "6C_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561636/TARGET_1_-_6C_WORDS_AND_IDEAS_ivc5nj.mp3",
    "6C_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561636/TARGET_1_-_6C_TARGET_SITUATION_jpfdfn.mp3",
    "6C_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561638/TARGET_1_-_6C_CROSS_CURRRICULAR_x1y9mf.mp4",

    # 7A
    "7A_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561639/TARGET_1_-_7A_WORDS_AND_IDEAS_iqxpi9.mp3",
    "7A_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561638/TARGET_1_-_7A_TARGET_SITUATION_pwrr4i.mp3",
    "7A_CROSS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561637/TARGET_1_-_7A_CROSS_CURRICULAR_aj0ald.mp3",

    # 7B
    "7B_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561641/TARGET_1_-_7B_WORD_AND_IDEAS_nnkdja.mp3",
    "7B_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561640/TARGET_1_-_7B_TARGET_SITUATION_lidzfq.mp3",

    # 7C
    "7C_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561643/TARGET_1_-_7C_WORDS_AND_IDEAS_196.MP3_zenkuo.mp3",
    "7C_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561643/TARGET_1_-_7C_TARGET_SITUATION_yzo8r0.mp3",
    "7C_CROSS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561642/TARGET_1_-_7C_CROSS_CIRCULAR_199.MP3_m1fiyq.mp3",

    # 8A
    "8A_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561651/TARGET_1_-8A_WORDS_AND_IDEAS_208.MP3_e3wuaz.mp3",
    "8A_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561646/TARGET_1_-_8A_TARGET_SITUATION_sd4nnh.mp3",
    "8A_CROSS_VIDEO": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561645/TARGET_1_-_8A_CROSS_CURRICULAR_coujdb.mp4",

    # 8B
    "8B_WORDS": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561647/TARGET_1_-_8B_WORDS_AND_IDEAS_rjyiq5.mp3",
    "8B_TARGET": "https://res.cloudinary.com/pfrqadfm/video/upload/v1791561646/TARGET_1_-_8B_TARGET_SITUATION_az2ubi.mp3"
}

def update_file(filename, updates):
    path = os.path.join("public", filename)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    for old, new in updates:
        if old in content:
            content = content.replace(old, new)
        else:
            print(f"Warning: pattern not found in {filename}: {old[:60]}...")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {filename}")

# --- 1A ---
update_file("licao1a.html", [
    (
        '<audio id="audio-1" src="https://files.catbox.moe/tzcgnr.mp3"></audio>',
        f'<audio id="audio-1" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["1A_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-2" src="https://files.catbox.moe/eg41yt.mp3"></audio>',
        f'<audio id="audio-2" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["1A_TARGET"]}"></audio>'
    ),
    (
        '<source src="https://files.catbox.moe/fu1l3l.mp4" type="video/mp4">',
        f'<source src="{CLOUDINARY_MAP["1A_CROSS_VIDEO"]}" type="video/mp4">'
    ),
    (
        '<video controls style="width: 100%; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">',
        '<video controls crossorigin="anonymous" preload="metadata" style="width: 100%; border-radius: 12px; margin-bottom: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">'
    )
])

# --- 1B ---
update_file("licao1b.html", [
    (
        '<audio id="audio-ts" src="https://files.catbox.moe/nrubf0.mp3"></audio>',
        f'<audio id="audio-ts" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["1B_TARGET"]}"></audio>'
    ),
    (
        '<p class="instruction">Find the places in the town in the wordsearch below. Click and drag across the letters.</p>',
        f'<p class="instruction">Find the places in the town in the wordsearch below. Click and drag across the letters.</p>\n            <div class="audio-player" style="background: var(--theme-blue-bg); border: 1px solid var(--theme-blue-border); color: var(--theme-blue-border); margin-bottom: 20px;">\n                <audio id="audio-wi" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["1B_WORDS"]}"></audio>\n                <button type="button" class="play-btn" id="btn-wi" style="background: var(--theme-blue-border);" onclick="toggleAudio(\'audio-wi\', \'btn-wi\', \'var(--theme-blue-border)\')">▶ PLAY</button>\n                <button type="button" class="speed-btn" id="spd-wi" style="background: #e2e8f0; color: #1e293b; border-color: #cbd5e1;" onclick="changeSpeed(\'audio-wi\', \'spd-wi\')">⚡ 1.0x</button>\n                <span>Words and Ideas Audio</span>\n            </div>'
    )
])

# --- 1C ---
update_file("licao1c.html", [
    (
        '<audio id="audio-ts" src="https://files.catbox.moe/pxviso.mp3"></audio>',
        f'<audio id="audio-ts" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["1C_TARGET"]}"></audio>'
    ),
    (
        '<audio id="audio-lw" src="https://files.catbox.moe/6y599k.mp3"></audio>',
        f'<audio id="audio-lw" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["1C_WORK"]}"></audio>'
    ),
    (
        '<p class="instruction">Practice spelling using the virtual keyboard. Click on a field below, then type the letters.</p>',
        f'<p class="instruction">Practice spelling using the virtual keyboard. Click on a field below, then type the letters.</p>\n            <div style="margin-bottom: 25px; text-align: center;">\n                <video controls crossorigin="anonymous" preload="metadata" style="width: 100%; max-width: 620px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"><source src="{CLOUDINARY_MAP["1C_GUIDE_VIDEO"]}" type="video/mp4">Your browser does not support the video tag.</video>\n            </div>'
    ),
    (
        '<div class="story-transition-box">',
        f'<div style="margin-bottom: 25px; text-align: center;">\n                <h3 style="color: var(--blue-dark); font-family: var(--font-title); font-size: 18px; margin-bottom: 12px;">🎬 Cross Curricular Video</h3>\n                <video controls crossorigin="anonymous" preload="metadata" style="width: 100%; max-width: 620px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);"><source src="{CLOUDINARY_MAP["1C_CROSS_VIDEO"]}" type="video/mp4">Your browser does not support the video tag.</video>\n            </div>\n            <div class="story-transition-box">'
    )
])

# --- 2A ---
update_file("licao2a.html", [
    (
        '<audio id="audio-2a" src="https://files.catbox.moe/pr9irg.mp3"></audio>',
        f'<audio id="audio-2a" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["2A_TARGET"]}"></audio>'
    ),
    (
        '<source src="https://files.catbox.moe/3wi73g.mp4" type="video/mp4">',
        f'<source src="{CLOUDINARY_MAP["2A_CROSS_VIDEO"]}" type="video/mp4">'
    ),
    (
        '<video controls style="width: 100%; border-radius: 12px; outline: none; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">',
        '<video controls crossorigin="anonymous" preload="metadata" style="width: 100%; border-radius: 12px; outline: none; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">'
    )
])

# --- 2B ---
update_file("licao2b.html", [
    (
        '<audio id="audio-2b" src="https://files.catbox.moe/fuqa5y.mp3"></audio>',
        f'<audio id="audio-2b" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["2B_TARGET"]}"></audio>'
    ),
    (
        '<audio id="audio-hw" src="https://files.catbox.moe/9hib9e.mp3"></audio>',
        f'<audio id="audio-hw" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["2B_CROSS"]}"></audio>'
    )
])

# --- 2C ---
update_file("licao2c.html", [
    (
        '<audio id="audio-2c" src="https://files.catbox.moe/jmr5iy.mp3"></audio>',
        f'<audio id="audio-2c" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["2C_TARGET"]}"></audio>'
    ),
    (
        '<audio id="audio-2c-cc" src="https://files.catbox.moe/qqzg9p.mp3"></audio>',
        f'<audio id="audio-2c-cc" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["2C_CROSS"]}"></audio>'
    )
])

# --- 3A ---
update_file("licao3a.html", [
    (
        '<audio id="audio-1" src="https://files.catbox.moe/z1uc6q.mp3"></audio>',
        f'<audio id="audio-1" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["3A_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-2" src="https://files.catbox.moe/cpsnhi.mp3"></audio>',
        f'<audio id="audio-2" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["3A_TARGET"]}"></audio>'
    ),
    (
        '<audio id="audio-hw" src="https://files.catbox.moe/btocrs.mp3"></audio>',
        f'<audio id="audio-hw" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["3A_CROSS"]}"></audio>'
    )
])

# --- 3B ---
update_file("licao3b.html", [
    (
        '<audio id="audio-wi" src="https://files.catbox.moe/aqsgn0.mp3"></audio>',
        f'<audio id="audio-wi" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["3B_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-ts" src="https://files.catbox.moe/3k1osu.mp3"></audio>',
        f'<audio id="audio-ts" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["3B_TARGET"]}"></audio>'
    ),
    (
        '<source src="https://files.catbox.moe/ymvsoi.mp4" type="video/mp4">',
        f'<source src="{CLOUDINARY_MAP["3B_CROSS_VIDEO"]}" type="video/mp4">'
    ),
    (
        '<video controls>',
        '<video controls crossorigin="anonymous" preload="metadata">'
    )
])

# --- 3C ---
update_file("licao3c.html", [
    (
        '<audio id="audio-ts" src="https://files.catbox.moe/m29e25.mp3"></audio>',
        f'<audio id="audio-ts" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["3C_TARGET"]}"></audio>'
    ),
    (
        '<source src="https://files.catbox.moe/s57721.mp4" type="video/mp4">',
        f'<source src="{CLOUDINARY_MAP["3C_CROSS_VIDEO"]}" type="video/mp4">'
    ),
    (
        '<video controls>',
        '<video controls crossorigin="anonymous" preload="metadata">'
    )
])

# --- 3D ---
update_file("licao3d.html", [
    (
        '<p class="instruction">Drag the clothes and items to the correct season: Summer or Winter?</p>',
        f'<p class="instruction">Drag the clothes and items to the correct season: Summer or Winter?</p>\n            <div class="audio-player" style="background: var(--theme-purple-bg); border: 1px solid var(--theme-purple-border); color: var(--theme-purple-border); margin-bottom: 25px; padding: 12px 20px; border-radius: 50px; display: inline-flex; align-items: center; gap: 15px;">\n                <audio id="audio-starter" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["3D_STARTER"]}"></audio>\n                <button type="button" class="btn-nav" id="btn-starter" style="padding: 6px 18px; font-size: 14px; background: var(--theme-purple-border); color: white; border: none;" onclick="const a=document.getElementById(\'audio-starter\');if(a.paused){{a.play();this.innerText=\'⏸ PAUSE\';}}else{{a.pause();this.innerText=\'▶ PLAY\';}}a.onended=()=>{{this.innerText=\'▶ PLAY\';}}">▶ PLAY</button>\n                <span style="font-weight: 700;">Track 3D: Starter Challenge Audio</span>\n            </div>'
    )
])

# --- 4A ---
update_file("licao4a.html", [
    (
        '<audio id="audio-1" src="https://files.catbox.moe/phe46l.mp3" preload="none"></audio>',
        f'<audio id="audio-1" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4A_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-2" src="https://res.cloudinary.com/pfrqadfm/video/upload/v1788831897/TARGET_1_-_4A_TARGET_SITUATION_rlezaf.mp3" preload="none"></audio>',
        f'<audio id="audio-2" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4A_TARGET"]}"></audio>'
    ),
    (
        '<audio id="audio-ts-map" src="https://res.cloudinary.com/pfrqadfm/video/upload/v1788831897/TARGET_1_-_4A_TARGET_SITUATION_rlezaf.mp3" preload="none"></audio>',
        f'<audio id="audio-ts-map" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4A_TARGET"]}"></audio>'
    )
])

# Add 4A cross-curricular audio players in sec-uptoyou if not already present
with open("public/licao4a.html", "r", encoding="utf-8") as f:
    c4a = f.read()

if "TARGET_1_-_4A_CROSS_CURRICULAR_ACTIVITY_1" not in c4a:
    target_needle = '<div id="sec-uptoyou" class="activity-section theme-yellow active" style="margin-top: 25px;">'
    replacement_4a = f"""<div class="exercise-card" style="margin-bottom: 25px;">
                <p><b>Cross Curricular Audio Tracks:</b></p>
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <div class="audio-player" style="margin-bottom: 10px;">
                        <audio id="audio-cc1" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4A_CROSS_1"]}"></audio>
                        <button type="button" class="play-btn" onclick="toggleAudio('audio-cc1', this.id)" id="btn-cc1">▶ PLAY</button>
                        <span>Cross Curricular Activity 1</span>
                    </div>
                    <div class="audio-player" style="margin-bottom: 10px;">
                        <audio id="audio-cc2" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4A_CROSS_2"]}"></audio>
                        <button type="button" class="play-btn" onclick="toggleAudio('audio-cc2', this.id)" id="btn-cc2">▶ PLAY</button>
                        <span>Cross Curricular Activity 2</span>
                    </div>
                </div>
            </div>
            {target_needle}"""
    c4a = c4a.replace(target_needle, replacement_4a)
    with open("public/licao4a.html", "w", encoding="utf-8") as f:
        f.write(c4a)
    print("Added 4A Cross Curricular audios")

# --- 4B ---
update_file("licao4b.html", [
    (
        '<audio id="audio-words" src="https://files.catbox.moe/4jajwy.mp3" preload="none"></audio>',
        f'<audio id="audio-words" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4B_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-target" src="https://files.catbox.moe/tfq26j.mp3" preload="none"></audio>',
        f'<audio id="audio-target" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4B_TARGET"]}"></audio>'
    ),
    (
        '<audio id="audio-cross" src="https://files.catbox.moe/2m06lt.mp3" preload="none"></audio>',
        f'<audio id="audio-cross" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4B_CROSS"]}"></audio>'
    ),
    (
        '<audio id="audio-law1" src="https://files.catbox.moe/87ej9g.mp3" preload="none"></audio>',
        f'<audio id="audio-law1" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4B_WORK"]}"></audio>'
    )
])

# --- 4C ---
update_file("licao4c.html", [
    (
        '<audio id="audio-1" src="https://files.catbox.moe/es33tg.mp3" preload="none"></audio>',
        f'<audio id="audio-1" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4C_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-2" src="https://files.catbox.moe/es33tg.mp3" preload="none"></audio>',
        f'<audio id="audio-2" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["4C_TARGET"]}"></audio>'
    )
])

# --- 5A ---
update_file("licao5a.html", [
    (
        '<audio id="audio-warmup" src="https://files.catbox.moe/3uuee3.mp3" preload="none"></audio>',
        f'<audio id="audio-warmup" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["5A_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-target" src="https://files.catbox.moe/3uuee3.mp3" preload="none"></audio>',
        f'<audio id="audio-target" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["5A_TARGET"]}"></audio>'
    ),
    (
        '<source src="https://files.catbox.moe/3euqn0.mp4" type="video/mp4">',
        f'<source src="{CLOUDINARY_MAP["5A_CROSS_VIDEO"]}" type="video/mp4">'
    ),
    (
        '<video controls style="max-width: 100%; width: 620px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" preload="metadata">',
        '<video controls crossorigin="anonymous" preload="metadata" style="max-width: 100%; width: 620px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">'
    )
])

# --- 5B ---
update_file("licao5b.html", [
    (
        '<audio id="audio-words" src="https://files.catbox.moe/3uuee3.mp3" preload="none"></audio>',
        f'<audio id="audio-words" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["5B_WORDS"]}"></audio>'
    ),
    (
        '<source src="https://files.catbox.moe/3euqn0.mp4" type="video/mp4">',
        f'<source src="{CLOUDINARY_MAP["5B_CROSS_VIDEO"]}" type="video/mp4">'
    ),
    (
        '<video controls style="max-width: 100%; width: 620px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" preload="metadata">',
        '<video controls crossorigin="anonymous" preload="metadata" style="max-width: 100%; width: 620px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">'
    )
])

# Add 5B Target Situation player if not present
with open("public/licao5b.html", "r", encoding="utf-8") as f:
    c5b = f.read()
if "TARGET_1_-_5B_TARGET_SITUATION" not in c5b:
    needle_5b = '<!-- ==========================================\n        <!-- 2. LANGUAGE GUIDE'
    if needle_5b not in c5b:
        needle_5b = '<!-- 2. LANGUAGE GUIDE'
    rep_5b = f"""<!-- TARGET SITUATION -->
        <div style="background: white; padding: 25px; border-radius: 16px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 18px;">🎯 Target Situation</h3>
            <div class="audio-player" id="player-target">
                <audio id="audio-target" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["5B_TARGET"]}"></audio>
                <button type="button" class="play-btn" id="btn-audio-target" onclick="toggleAudio('audio-target', 'btn-audio-target')">▶ PLAY</button>
                <button type="button" class="audio-ctrl-btn speed-btn" id="spd-audio-target" onclick="cycleSpeed('audio-target', 'spd-audio-target')">⚡ 1.0x</button>
                <span class="audio-track-label">Track 5B: Target Situation Routine</span>
            </div>
        </div>

        {needle_5b}"""
    c5b = c5b.replace(needle_5b, rep_5b)
    with open("public/licao5b.html", "w", encoding="utf-8") as f:
        f.write(c5b)
    print("Added 5B Target Situation audio")

# --- 5C ---
update_file("licao5c.html", [
    (
        '<audio id="audio-words" src="https://files.catbox.moe/3uuee3.mp3" preload="none"></audio>',
        f'<audio id="audio-words" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["5C_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-target" src="https://files.catbox.moe/3uuee3.mp3" preload="none"></audio>',
        f'<audio id="audio-target" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["5C_TARGET"]}"></audio>'
    )
])

# --- 6A ---
update_file("licao6a.html", [
    (
        '<audio id="audio-words" style="display: none;" preload="none"></audio>',
        f'<audio id="audio-words" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["6A_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-dialogue" style="display: none;" preload="none"></audio>',
        f'<audio id="audio-dialogue" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["6A_TARGET"]}"></audio>'
    )
])
with open("public/licao6a.html", "r", encoding="utf-8") as f:
    c6a = f.read()
if "TARGET_1_-_6A_CROSS_CURRICULAR" not in c6a:
    needle_6a = '<h2>📅 4. HOMEWORK / CROSS CURRICULAR</h2>'
    rep_6a = f"""<h2>📅 4. HOMEWORK / CROSS CURRICULAR</h2>
            <div style="margin-bottom: 22px; text-align: center;">
                <video controls crossorigin="anonymous" preload="metadata" style="max-width: 100%; width: 620px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
                    <source src="{CLOUDINARY_MAP["6A_CROSS_VIDEO"]}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>"""
    c6a = c6a.replace(needle_6a, rep_6a)
    with open("public/licao6a.html", "w", encoding="utf-8") as f:
        f.write(c6a)
    print("Added 6A Cross Curricular video")

# --- 6B ---
update_file("licao6b.html", [
    (
        '<audio id="audio-hobbies" style="display: none;" preload="none"></audio>',
        f'<audio id="audio-hobbies" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["6B_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-dialogue" style="display: none;" preload="none"></audio>',
        f'<audio id="audio-dialogue" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["6B_TARGET_PLACEHOLDER"]}"></audio>'
    ),
    (
        '<audio id="audio-tom" style="display: none;" preload="none"></audio>',
        f'<audio id="audio-tom" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["6B_CROSS"]}"></audio>'
    )
])

# --- 6C ---
update_file("licao6c.html", [
    (
        '<audio id="audio-verbs" style="display: none;" preload="none"></audio>',
        f'<audio id="audio-verbs" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["6C_WORDS"]}"></audio>'
    )
])
with open("public/licao6c.html", "r", encoding="utf-8") as f:
    c6c = f.read()

if "TARGET_1_-_6C_TARGET_SITUATION" not in c6c:
    needle_6c = '<h2>💬 2. TARGET SITUATION</h2>'
    rep_6c = f"""<h2>💬 2. TARGET SITUATION</h2>
            <div class="audio-wrapper" style="margin-bottom: 20px;">
                <div class="audio-player" data-script-key="script-6c-target">
                    <audio id="audio-target" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["6C_TARGET"]}"></audio>
                    <button type="button" class="play-btn" id="btn-audio-target" onclick="toggleAudio('audio-target', 'btn-audio-target')">▶ PLAY</button>
                    <button type="button" class="audio-ctrl-btn slow-btn" id="slow-audio-target" onclick="changeSpeedDirect('audio-target', 'spd-audio-target', 0.75, 'slow-audio-target')">🐢 0.75x</button>
                    <button type="button" class="audio-ctrl-btn speed-btn" id="spd-audio-target" onclick="cycleSpeed('audio-target', 'spd-audio-target')">⚡ 1.0x</button>
                    <button type="button" class="audio-ctrl-btn fast-btn" id="fast-audio-target" onclick="changeSpeedDirect('audio-target', 'spd-audio-target', 1.25, 'fast-audio-target')">🐇 1.25x</button>
                    <span class="audio-track-label">Track 6C.2: Target Situation Conversation</span>
                </div>
            </div>"""
    c6c = c6c.replace(needle_6c, rep_6c)

if "TARGET_1_-_6C_CROSS_CURRRICULAR" not in c6c:
    needle_6c_vid = '<div id="sec-home" class="activity-section theme-orange">'
    rep_6c_vid = f"""<div id="sec-home" class="activity-section theme-orange">
            <div style="margin-bottom: 22px; text-align: center;">
                <video controls crossorigin="anonymous" preload="metadata" style="max-width: 100%; width: 620px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
                    <source src="{CLOUDINARY_MAP["6C_CROSS_VIDEO"]}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>"""
    c6c = c6c.replace(needle_6c_vid, rep_6c_vid)

with open("public/licao6c.html", "w", encoding="utf-8") as f:
    f.write(c6c)
print("Updated 6C Target Situation & Cross Curricular")

# --- 7A ---
update_file("licao7a.html", [
    (
        '<audio id="audio-flat-dialogue" style="display: none;" preload="none"></audio>',
        f'<audio id="audio-flat-dialogue" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["7A_TARGET"]}"></audio>'
    ),
    (
        '<audio id="audio-desc-flat" style="display: none;" preload="none"></audio>',
        f'<audio id="audio-desc-flat" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["7A_CROSS"]}"></audio>'
    )
])
with open("public/licao7a.html", "r", encoding="utf-8") as f:
    c7a = f.read()
if "TARGET_1_-_7A_WORDS_AND_IDEAS" not in c7a:
    needle_7a = '<h2>🏠 1. WARM UP & WORDS AND IDEAS</h2>'
    rep_7a = f"""<h2>🏠 1. WARM UP & WORDS AND IDEAS</h2>
            <div class="audio-wrapper" style="margin-bottom: 20px;">
                <div class="audio-player" data-script-key="script-7a-words">
                    <audio id="audio-7a-words" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["7A_WORDS"]}"></audio>
                    <button type="button" class="play-btn" id="btn-audio-7a-words" onclick="toggleAudio('audio-7a-words', 'btn-audio-7a-words')">▶ PLAY</button>
                    <button type="button" class="audio-ctrl-btn speed-btn" id="spd-audio-7a-words" onclick="cycleSpeed('audio-7a-words', 'spd-audio-7a-words')">⚡ 1.0x</button>
                    <span class="audio-track-label">Track 7A.1: House & Furniture Words and Ideas</span>
                </div>
            </div>"""
    c7a = c7a.replace(needle_7a, rep_7a)
    with open("public/licao7a.html", "w", encoding="utf-8") as f:
        f.write(c7a)
    print("Added 7A Words and Ideas audio")

# --- 7B ---
update_file("licao7b.html", [
    (
        '<audio id="audio-7b" preload="none"></audio>',
        f'<audio id="audio-7b" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["7B_TARGET"]}"></audio>'
    )
])
with open("public/licao7b.html", "r", encoding="utf-8") as f:
    c7b = f.read()
if "TARGET_1_-_7B_WORD_AND_IDEAS" not in c7b:
    needle_7b = '<h2>1. WARM UP: LIVING ROOM FURNITURE</h2>'
    if needle_7b not in c7b:
        needle_7b = '1. WARM UP'
    rep_7b = f"""<div class="audio-wrapper" style="margin-bottom: 20px;">
                <div class="audio-player" data-script-key="script-7b-words">
                    <audio id="audio-7b-words" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["7B_WORDS"]}"></audio>
                    <button type="button" class="play-btn" id="btn-audio-7b-words" onclick="handleAudioPlay('audio-7b-words', 'btn-audio-7b-words', 'script-7b-words', 'var(--blue-dark)')">▶ PLAY</button>
                    <button type="button" class="audio-ctrl-btn speed-btn" id="spd-audio-7b-words" onclick="cycleSpeed('audio-7b-words', 'spd-audio-7b-words')">⚡ 1.0x</button>
                    <span class="audio-track-label">Track 7B.2: Words and Ideas Vocabulary</span>
                </div>
            </div>
            {needle_7b}"""
    c7b = c7b.replace(needle_7b, rep_7b, 1)
    with open("public/licao7b.html", "w", encoding="utf-8") as f:
        f.write(c7b)
    print("Added 7B Words and Ideas audio")

# --- 7C ---
update_file("licao7c.html", [
    (
        '<audio id="audio-7c" preload="none"></audio>',
        f'<audio id="audio-7c" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["7C_TARGET"]}"></audio>'
    )
])
with open("public/licao7c.html", "r", encoding="utf-8") as f:
    c7c = f.read()
if "TARGET_1_-_7C_WORDS_AND_IDEAS" not in c7c:
    needle_7c = '<div id="sec-warmup" class="activity-section theme-purple active">'
    rep_7c = f"""<div id="sec-warmup" class="activity-section theme-purple active">
            <div class="audio-wrapper" style="margin-bottom: 20px;">
                <div class="audio-player" data-script-key="script-7c-words">
                    <audio id="audio-7c-words" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["7C_WORDS"]}"></audio>
                    <button type="button" class="play-btn" id="btn-audio-7c-words" onclick="handleAudioPlay('audio-7c-words', 'btn-audio-7c-words', 'script-7c-words', 'var(--blue-dark)')">▶ PLAY</button>
                    <button type="button" class="audio-ctrl-btn speed-btn" id="spd-audio-7c-words" onclick="cycleSpeed('audio-7c-words', 'spd-audio-7c-words')">⚡ 1.0x</button>
                    <span class="audio-track-label">Track 7C.2: Words and Ideas Vocabulary</span>
                </div>
            </div>"""
    c7c = c7c.replace(needle_7c, rep_7c, 1)

if "TARGET_1_-_7C_CROSS_CIRCULAR" not in c7c:
    needle_7c_cross = '<div id="sec-home" class="activity-section theme-orange">'
    rep_7c_cross = f"""<div id="sec-home" class="activity-section theme-orange">
            <div class="audio-wrapper" style="margin-bottom: 20px;">
                <div class="audio-player" data-script-key="script-7c-cross">
                    <audio id="audio-7c-cross" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["7C_CROSS"]}"></audio>
                    <button type="button" class="play-btn" id="btn-audio-7c-cross" onclick="handleAudioPlay('audio-7c-cross', 'btn-audio-7c-cross', 'script-7c-cross', 'var(--blue-dark)')">▶ PLAY</button>
                    <button type="button" class="audio-ctrl-btn speed-btn" id="spd-audio-7c-cross" onclick="cycleSpeed('audio-7c-cross', 'spd-audio-7c-cross')">⚡ 1.0x</button>
                    <span class="audio-track-label">Track 7C.3: Cross Curricular Audio</span>
                </div>
            </div>"""
    c7c = c7c.replace(needle_7c_cross, rep_7c_cross, 1)

with open("public/licao7c.html", "w", encoding="utf-8") as f:
    f.write(c7c)
print("Updated 7C Words and Ideas & Cross Curricular")

# --- 8A ---
update_file("licao8a.html", [
    (
        '<audio id="audio-8a1" preload="none"></audio>',
        f'<audio id="audio-8a1" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["8A_WORDS"]}"></audio>'
    ),
    (
        '<audio id="audio-8a2" preload="none"></audio>',
        f'<audio id="audio-8a2" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["8A_TARGET"]}"></audio>'
    )
])
with open("public/licao8a.html", "r", encoding="utf-8") as f:
    c8a = f.read()
if "TARGET_1_-_8A_CROSS_CURRICULAR" not in c8a:
    needle_8a = '<div id="sec-home" class="activity-section theme-orange">'
    rep_8a = f"""<div id="sec-home" class="activity-section theme-orange">
            <div style="margin-bottom: 22px; text-align: center;">
                <video controls crossorigin="anonymous" preload="metadata" style="max-width: 100%; width: 620px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);">
                    <source src="{CLOUDINARY_MAP["8A_CROSS_VIDEO"]}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            </div>"""
    c8a = c8a.replace(needle_8a, rep_8a)
    with open("public/licao8a.html", "w", encoding="utf-8") as f:
        f.write(c8a)
    print("Added 8A Cross Curricular video")

# --- 8B ---
update_file("licao8b.html", [
    (
        '<audio id="audio-8b" style="display: none;" preload="none"></audio>',
        f'<audio id="audio-8b" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["8B_TARGET"]}"></audio>'
    )
])
with open("public/licao8b.html", "r", encoding="utf-8") as f:
    c8b = f.read()
if "TARGET_1_-_8B_WORDS_AND_IDEAS" not in c8b:
    needle_8b = '<div id="sec-warmup" class="activity-section theme-purple active">'
    rep_8b = f"""<div id="sec-warmup" class="activity-section theme-purple active">
            <div class="audio-wrapper" style="margin-bottom: 20px;">
                <div class="audio-player" data-script-key="script-8b-words">
                    <audio id="audio-8b-words" style="display: none;" crossorigin="anonymous" preload="metadata" src="{CLOUDINARY_MAP["8B_WORDS"]}"></audio>
                    <button type="button" class="play-btn" id="btn-audio-8b-words" onclick="toggleAudio('audio-8b-words', 'btn-audio-8b-words')">▶ PLAY</button>
                    <button type="button" class="audio-ctrl-btn speed-btn" id="spd-audio-8b-words" onclick="cycleSpeed('audio-8b-words', 'spd-audio-8b-words')">⚡ 1.0x</button>
                    <span class="audio-track-label">Track 8B.1: Words and Ideas Vocabulary</span>
                </div>
            </div>"""
    c8b = c8b.replace(needle_8b, rep_8b)
    with open("public/licao8b.html", "w", encoding="utf-8") as f:
        f.write(c8b)
    print("Added 8B Words and Ideas audio")

# --- audios.html (LMS Media Hub) ---
with open("public/audios.html", "r", encoding="utf-8") as f:
    ca = f.read()

# Replace all corresponding tracks in audios.html
audios_replacements = [
    ("https://files.catbox.moe/11y06w.mp3", CLOUDINARY_MAP["1A_WORDS"]),
    ("https://files.catbox.moe/k20436.mp3", CLOUDINARY_MAP["1A_TARGET"]),
    ("https://files.catbox.moe/fu1l3l.mp4", CLOUDINARY_MAP["1A_CROSS_VIDEO"]),

    ("https://files.catbox.moe/19w46h.mp3", CLOUDINARY_MAP["1B_WORDS"]),
    ("https://files.catbox.moe/2s9n95.mp3", CLOUDINARY_MAP["1B_TARGET"]),

    ("https://files.catbox.moe/x9w7b4.mp3", CLOUDINARY_MAP["1C_TARGET"]),
    ("https://files.catbox.moe/y7m91y.mp3", CLOUDINARY_MAP["1C_WORK"]),
    ("https://files.catbox.moe/n1k40k.mp4", CLOUDINARY_MAP["1C_GUIDE_VIDEO"]),
    ("https://files.catbox.moe/x1g5w9.mp4", CLOUDINARY_MAP["1C_CROSS_VIDEO"]),

    ("https://files.catbox.moe/162p61.mp3", CLOUDINARY_MAP["2A_TARGET"]),
    ("https://files.catbox.moe/3wi73g.mp4", CLOUDINARY_MAP["2A_CROSS_VIDEO"]),

    ("https://files.catbox.moe/97a5q7.mp3", CLOUDINARY_MAP["2B_TARGET"]),
    ("https://files.catbox.moe/u3m4k1.mp3", CLOUDINARY_MAP["2B_CROSS"]),

    ("https://files.catbox.moe/s5s0v0.mp3", CLOUDINARY_MAP["2C_TARGET"]),
    ("https://files.catbox.moe/x50j41.mp3", CLOUDINARY_MAP["2C_CROSS"]),

    ("https://files.catbox.moe/y86f1k.mp3", CLOUDINARY_MAP["3A_WORDS"]),
    ("https://files.catbox.moe/s20j47.mp3", CLOUDINARY_MAP["3A_TARGET"]),
    ("https://files.catbox.moe/y8m54y.mp3", CLOUDINARY_MAP["3A_CROSS"]),

    ("https://files.catbox.moe/m7j2v4.mp3", CLOUDINARY_MAP["3B_WORDS"]),
    ("https://files.catbox.moe/22x141.mp3", CLOUDINARY_MAP["3B_TARGET"]),
    ("https://files.catbox.moe/ymvsoi.mp4", CLOUDINARY_MAP["3B_CROSS_VIDEO"]),

    ("https://files.catbox.moe/67x0w0.mp3", CLOUDINARY_MAP["3C_TARGET"]),
    ("https://files.catbox.moe/s57721.mp4", CLOUDINARY_MAP["3C_CROSS_VIDEO"]),

    ("https://files.catbox.moe/90j540.mp3", CLOUDINARY_MAP["3D_STARTER"]),

    ("https://files.catbox.moe/94m541.mp3", CLOUDINARY_MAP["4A_WORDS"]),
    ("https://files.catbox.moe/39103q.mp3", CLOUDINARY_MAP["4A_TARGET"]),
    ("https://files.catbox.moe/42x01k.mp3", CLOUDINARY_MAP["4A_CROSS_1"]),
    ("https://files.catbox.moe/02x401.mp3", CLOUDINARY_MAP["4A_CROSS_2"]),

    ("https://files.catbox.moe/102j4q.mp3", CLOUDINARY_MAP["4B_WORDS"]),
    ("https://files.catbox.moe/42x100.mp3", CLOUDINARY_MAP["4B_TARGET"]),
    ("https://files.catbox.moe/103m5y.mp3", CLOUDINARY_MAP["4B_WORK"]),
    ("https://files.catbox.moe/105j4q.mp3", CLOUDINARY_MAP["4B_CROSS"]),

    ("https://files.catbox.moe/110m51.mp3", CLOUDINARY_MAP["4C_WORDS"]),
    ("https://files.catbox.moe/40103q.mp3", CLOUDINARY_MAP["4C_TARGET"]),

    ("https://files.catbox.moe/122j4q.mp3", CLOUDINARY_MAP["5A_WORDS"]),
    ("https://files.catbox.moe/123j4q.mp3", CLOUDINARY_MAP["5A_TARGET"]),
    ("https://files.catbox.moe/3euqn0.mp4", CLOUDINARY_MAP["5A_CROSS_VIDEO"]),

    ("https://files.catbox.moe/ou3big.mp3", CLOUDINARY_MAP["5B_WORDS"]),
    ("https://files.catbox.moe/ju4ybz.mp3", CLOUDINARY_MAP["5B_TARGET"]),
    ("https://files.catbox.moe/0n2car.mp4", CLOUDINARY_MAP["5B_CROSS_VIDEO"]),

    ("https://files.catbox.moe/syxssf.mp3", CLOUDINARY_MAP["5C_WORDS"]),
    ("https://files.catbox.moe/5x94yq.mp3", CLOUDINARY_MAP["5C_TARGET"]),

    ("https://files.catbox.moe/9adqoc.mp3", CLOUDINARY_MAP["6A_WORDS"]),
    ("https://files.catbox.moe/3nj2kp.mp3", CLOUDINARY_MAP["6A_TARGET"]),
    ("https://files.catbox.moe/emtp9z.mp4", CLOUDINARY_MAP["6A_CROSS_VIDEO"]),

    ("https://files.catbox.moe/x7wm5n.mp3", CLOUDINARY_MAP["6B_WORDS"]),
    ("https://files.catbox.moe/kb2z43.mp3", CLOUDINARY_MAP["6B_CROSS"]),

    ("https://files.catbox.moe/1a2l60.mp3", CLOUDINARY_MAP["6C_WORDS"]),
    ("https://files.catbox.moe/bdp28g.mp3", CLOUDINARY_MAP["6C_TARGET"]),
    ("https://files.catbox.moe/cyccjq.mp4", CLOUDINARY_MAP["6C_CROSS_VIDEO"]),

    ("https://files.catbox.moe/jqg4ut.mp3", CLOUDINARY_MAP["7A_WORDS"]),
    ("https://files.catbox.moe/bszet1.mp3", CLOUDINARY_MAP["7A_TARGET"]),
    ("https://files.catbox.moe/apg1y0.mp3", CLOUDINARY_MAP["7A_CROSS"]),

    ("https://files.catbox.moe/g71h3g.mp3", CLOUDINARY_MAP["7B_WORDS"]),
    ("https://files.catbox.moe/qexzld.mp3", CLOUDINARY_MAP["7B_TARGET"]),

    ("https://files.catbox.moe/thd7am.mp3", CLOUDINARY_MAP["7C_WORDS"]),
    ("https://files.catbox.moe/z1oiqw.mp3", CLOUDINARY_MAP["7C_TARGET"]),

    ("https://files.catbox.moe/glb5x6.mp3", CLOUDINARY_MAP["8A_WORDS"]),
    ("https://files.catbox.moe/6fynxx.mp3", CLOUDINARY_MAP["8A_TARGET"]),
    ("https://files.catbox.moe/beloh3.mp4", CLOUDINARY_MAP["8A_CROSS_VIDEO"]),

    ("https://files.catbox.moe/tj6afz.mp3", CLOUDINARY_MAP["8B_WORDS"]),
    ("https://files.catbox.moe/pug5fc.mp3", CLOUDINARY_MAP["8B_TARGET"])
]

for o, n in audios_replacements:
    ca = ca.replace(o, n)

with open("public/audios.html", "w", encoding="utf-8") as f:
    f.write(ca)
print("Updated audios.html")

print("Migration completed!")
