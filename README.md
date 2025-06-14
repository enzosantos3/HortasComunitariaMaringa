# 🌱 Hortas Comunitárias de Maringá - Mapeamento Sustentável

Este projeto é um sistema interativo de mapeamento que exibe hortas comunitárias de Maringá - PR. Ele utiliza tecnologias web modernas para mostrar no mapa a localização das hortas, gerar rotas até elas, aplicar filtros, visualizar estatísticas e muito mais.

## 🚀 Funcionalidades

- 🗺️ **Mapa interativo** com marcadores de todas as hortas
- 🔍 **Busca por nome, bairro, zona ou cultivo**
- 🧭 **Geração de rotas** até as hortas com base na localização do usuário
- 🧮 **Estatísticas dinâmicas**: número total de hortas, famílias beneficiadas, área total etc.
- 📄 **Exportação para PDF e CSV**
- 💾 **Modo offline** com armazenamento local (`localStorage`)
- 🌐 **Modo satélite/ruas**
- 📱 **Interface responsiva** para dispositivos móveis

## 🛠️ Tecnologias Utilizadas

- HTML5, CSS3 e JavaScript (vanilla)
- [Leaflet.js](https://leafletjs.com/) – biblioteca de mapas
- [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/) – rotas e direções
- [jsPDF](https://github.com/parallax/jsPDF) – exportação em PDF
- API de Geolocalização do navegador

## 📂 Estrutura de Pastas

```

hortas-comunitarias-maringa/
├── index.html
├── js/
│   └── script.js
├── css/
│   └── style.css

````

## ⚙️ Como Executar Localmente

### 🔸 Método Rápido

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` em seu navegador.

> Algumas funcionalidades como **geolocalização** e **modo offline** podem não funcionar corretamente ao abrir direto do arquivo. Use um servidor local para isso.

### 🔸 Usando Python (recomendado)

```bash
cd hortas-comunitarias-maringa
python -m http.server 8000
````

Depois, acesse:
[http://localhost:8000](http://localhost:8000)

---

## 📈 Dados

Os dados das hortas foram baseados em locais reais de Maringá-PR, com foco na simulação educacional para fins acadêmicos, utilizando dados públicos da Prefeitura de Maringá.

## 👥 Desenvolvedores

* Luiz Guilherme
* Victor Hugo
* Enzo dos Santos Mendes

---

## 📜 Licença

Este projeto é de uso educacional e sem fins lucrativos.

---
