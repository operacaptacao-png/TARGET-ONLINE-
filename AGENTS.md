# Regras Globais de Design e Comportamento do Projeto

## 1. Padronização de Navegação (Menu Buttons)
- Todas as seções visíveis do livro devem possuir uma barra de navegação padronizada (`<div class="nav-buttons">`).
- Se a seção for extensa, adicionar esta barra tanto no **topo** (`<div class="nav-buttons top-nav">`) quanto no **final** da seção.
- Os botões devem usar a classe `.btn-nav` com as etiquetas:
  - `"⬅ Back"` para retornar à seção anterior.
  - `"Next: [Nome da Seção] ➔"` para avançar à próxima seção.

## 2. Padronização do Reprodutor de Áudio
Sempre que houver um arquivo de som, o player não deve ser o padrão do HTML. Utilize obrigatoriamente a estrutura completa de botões personalizados:
- Contêiner `.audio-player` contendo:
  - Tag `<audio>` oculta (`display: none`).
  - Botão de reprodução (`▶ PLAY` ou `⏸ PAUSE` ao alternar) com a classe `.play-btn`.
  - Botão de redução de velocidade (`🐢 0.75x`) com as classes `.audio-ctrl-btn .slow-btn`.
  - Botão de velocidade normal (`⚡ 1.0x`) com as classes `.audio-ctrl-btn .speed-btn`.
  - Botão de aumento de velocidade (`🐇 1.25x`) com as classes `.audio-ctrl-btn .fast-btn`.
  - Etiqueta de identificação da faixa (`.audio-track-label`).

## 3. Funções JavaScript e Consistência
- Funções de controle de áudio obrigatórias:
  - `toggleAudio(audioId, btnId)`: alternância segura de play/pause com parada mútua de outros áudios.
  - `changeSpeedDirect(audioId, spdBtnId, targetRate, clickedBtnId)`: alteração direta da velocidade e sincronização de estilo ativo.
  - `cycleSpeed(audioId, spdBtnId)`: alternância cíclica de velocidade (0.75x, 1.0x, 1.25x, 1.5x).
  - `stopAllAudiosExcept(exceptId)`: parada limpa de áudios concorrentes.
- CSS padronizado para `.btn-nav`, `.audio-player`, `.play-btn`, `.audio-ctrl-btn` com estados `:hover` e `.active`.

## 4. Estética Gamificada e Trava de Segurança
- Todos os `<input type="text">` e `<textarea>` devem conter a classe `.fancy-input`.
- Validação automática através de campos `.eval-input` com atributo `data-ans`.
- Trava de leitura no `DOMContentLoaded` verificando `licao_XX_status === 'concluida'`, preenchendo as respostas salvas em `licaoXX_respostas`, aplicando `disabled = true` em todos os campos e desabilitando o botão de finalizar com o rótulo `"🔒 Lesson Completed (Read-Only)"`.
- Integração com LMS: cálculo de XP via `calculateXP()`, salvando no `localStorage`, disparando `window.parent.completeUnit(unitIdx, finalXP)` e `window.parent.avancarPara(proximaLicao, linkId)` com fallback para `window.location.href`.
