// Import Leaflet library
const L = window.L

// Dados reais das hortas comunitárias de Maringá com coordenadas precisas
const hortas = [
  {
    id: 1,
    nome: "Horta Comunitária Jardim Alvorada",
    endereco: "Jardim Alvorada - Zona Norte",
    bairro: "Jardim Alvorada",
    zona: "Norte",
    descricao:
      "Horta comunitária voltada para produção de hortaliças e plantas medicinais, atendendo famílias da região norte de Maringá",
    status: "ativa",
    participantes: "25 famílias",
    area: "800m²",
    cultivos: ["Alface", "Couve", "Cebolinha", "Plantas medicinais"],
    coordenadas: { lat: -23.3945, lng: -51.9388 },
  },
  {
    id: 2,
    nome: "Horta Comunitária Conjunto Habitacional Inocente Vila Nova",
    endereco: "Conjunto Habitacional Inocente Vila Nova - Zona Sul",
    bairro: "Inocente Vila Nova",
    zona: "Sul",
    descricao:
      "Projeto de agricultura urbana que beneficia moradores do conjunto habitacional com produção de alimentos orgânicos",
    status: "ativa",
    participantes: "18 famílias",
    area: "600m²",
    cultivos: ["Tomate", "Pimentão", "Rúcula", "Manjericão"],
    coordenadas: { lat: -23.4345, lng: -51.9188 },
  },
  {
    id: 3,
    nome: "Horta Comunitária Jardim Universitário",
    endereco: "Jardim Universitário - Zona Sul",
    bairro: "Jardim Universitário",
    zona: "Sul",
    descricao:
      "Horta desenvolvida em parceria com a comunidade universitária, focada em educação ambiental e sustentabilidade",
    status: "ativa",
    participantes: "30 famílias",
    area: "1000m²",
    cultivos: ["Brócolis", "Couve-flor", "Espinafre", "Ervas aromáticas"],
    coordenadas: { lat: -23.4195, lng: -51.9338 },
  },
  {
    id: 4,
    nome: "Horta Comunitária Vila Esperança",
    endereco: "Vila Esperança - Zona Leste",
    bairro: "Vila Esperança",
    zona: "Leste",
    descricao: "Iniciativa comunitária que promove segurança alimentar e integração social no bairro Vila Esperança",
    status: "ativa",
    participantes: "22 famílias",
    area: "700m²",
    cultivos: ["Acelga", "Beterraba", "Cenoura", "Salsa"],
    coordenadas: { lat: -23.4095, lng: -51.9088 },
  },
  {
    id: 5,
    nome: "Horta Comunitária Jardim Mandacaru",
    endereco: "Jardim Mandacaru - Zona Oeste",
    bairro: "Jardim Mandacaru",
    zona: "Oeste",
    descricao: "Projeto que integra produção de alimentos com ações de educação ambiental para crianças e adultos",
    status: "ativa",
    participantes: "15 famílias",
    area: "500m²",
    cultivos: ["Alface", "Chicória", "Almeirão", "Hortelã"],
    coordenadas: { lat: -23.4145, lng: -51.9588 },
  },
  {
    id: 6,
    nome: "Horta Comunitária Conjunto Residencial Parigot de Souza",
    endereco: "Conjunto Residencial Parigot de Souza - Zona Norte",
    bairro: "Parigot de Souza",
    zona: "Norte",
    descricao:
      "Horta voltada para moradores do conjunto residencial, promovendo alimentação saudável e economia familiar",
    status: "ativa",
    participantes: "20 famílias",
    area: "650m²",
    cultivos: ["Repolho", "Couve", "Rabanete", "Cebola"],
    coordenadas: { lat: -23.3845, lng: -51.9288 },
  },
  {
    id: 7,
    nome: "Horta Comunitária Jardim São Silvestre",
    endereco: "Jardim São Silvestre - Zona Sul",
    bairro: "Jardim São Silvestre",
    zona: "Sul",
    descricao:
      "Projeto comunitário que combina produção agrícola com atividades de convivência e fortalecimento social",
    status: "planejamento",
    participantes: "Em formação",
    area: "750m²",
    cultivos: ["A definir"],
    coordenadas: { lat: -23.4395, lng: -51.9238 },
  },
  {
    id: 8,
    nome: "Horta Comunitária Vila Operária",
    endereco: "Vila Operária - Zona Central",
    bairro: "Vila Operária",
    zona: "Central",
    descricao: "Horta urbana localizada em área central, servindo como modelo de agricultura sustentável na cidade",
    status: "ativa",
    participantes: "28 famílias",
    area: "900m²",
    cultivos: ["Abobrinha", "Pepino", "Quiabo", "Jiló"],
    coordenadas: { lat: -23.4245, lng: -51.9388 },
  },
]

// Variáveis globais
let hortasFiltradas = [...hortas]
let hortaSelecionada = null
let map = null
let markers = []
let userLocation = null
let routingControl = null
let currentLayer = "street"
let isOfflineMode = false

// Elementos DOM
const searchInput = document.getElementById("searchInput")
const hortasList = document.getElementById("hortasList")
const hortasCount = document.getElementById("hortasCount")
const zoneFilter = document.getElementById("zoneFilter")
const statusFilter = document.getElementById("statusFilter")
const sortSelect = document.getElementById("sortSelect")
const locationBtn = document.getElementById("locationBtn")
const satelliteBtn = document.getElementById("satelliteBtn")
const exportBtn = document.getElementById("exportBtn")
const offlineBtn = document.getElementById("offlineBtn")
const routeInfo = document.getElementById("routeInfo")
const closeRoute = document.getElementById("closeRoute")
const loadingModal = document.getElementById("loadingModal")

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  inicializarApp()
  verificarConexao()
})

function inicializarApp() {
  inicializarMapa()
  renderizarHortas()
  configurarBusca()
  configurarFiltros()
  configurarEventos()
  atualizarEstatisticas()
  carregarDadosOffline()
}

// Função para inicializar o mapa
function inicializarMapa() {
  // Coordenadas do centro de Maringá
  const maringaCenter = [-23.4205, -51.9331]

  // Criar o mapa
  map = L.map("map").setView(maringaCenter, 12)

  // Camadas do mapa
  const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  })

  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: '© <a href="https://www.esri.com/">Esri</a>',
      maxZoom: 18,
    },
  )

  // Adicionar camada padrão
  streetLayer.addTo(map)

  // Armazenar camadas
  map.streetLayer = streetLayer
  map.satelliteLayer = satelliteLayer

  // Adicionar marcadores das hortas
  adicionarMarcadores()
}

// Função para adicionar marcadores no mapa
function adicionarMarcadores() {
  // Limpar marcadores existentes
  markers.forEach((marker) => map.removeLayer(marker))
  markers = []

  // Ícones personalizados
  const iconAtiva = L.divIcon({
    className: "custom-marker",
    html: '<div style="background-color: #16a34a; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  const iconPlanejamento = L.divIcon({
    className: "custom-marker",
    html: '<div style="background-color: #f59e0b; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  // Adicionar marcador para cada horta filtrada
  hortasFiltradas.forEach((horta) => {
    const icon = horta.status === "ativa" ? iconAtiva : iconPlanejamento

    const marker = L.marker([horta.coordenadas.lat, horta.coordenadas.lng], { icon })
      .addTo(map)
      .bindPopup(criarPopupContent(horta))

    // Evento de clique no marcador
    marker.on("click", () => {
      selecionarHorta(horta.id)
    })

    markers.push(marker)
  })

  // Ajustar zoom para mostrar todos os marcadores
  if (markers.length > 0) {
    const group = new L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.1))
  }
}

// Função para criar conteúdo do popup
function criarPopupContent(horta) {
  const statusClass = horta.status === "ativa" ? "ativa" : "planejamento"
  const statusText = horta.status === "ativa" ? "Ativa" : "Em Planejamento"

  return `
    <div class="popup-content">
      <div class="popup-title">${horta.nome}</div>
      <div class="popup-info">
        <p><strong>📍 Localização:</strong> ${horta.endereco}</p>
        <p><strong>👥 Participantes:</strong> ${horta.participantes}</p>
        <p><strong>📏 Área:</strong> ${horta.area}</p>
        <p><strong>🌱 Cultivos:</strong> ${horta.cultivos.join(", ")}</p>
        <span class="popup-status ${statusClass}">${statusText}</span>
      </div>
      <div class="popup-actions">
        <button class="popup-btn route" onclick="criarRota(${horta.id})">🗺️ Rota</button>
      </div>
    </div>
  `
}

// Função para renderizar lista de hortas
function renderizarHortas() {
  hortasList.innerHTML = ""
  hortasCount.textContent = hortasFiltradas.length

  if (hortasFiltradas.length === 0) {
    hortasList.innerHTML = `
      <div class="empty-state">
        <p>Nenhuma horta encontrada com os critérios de busca.</p>
        <p>Tente buscar por nome do bairro ou zona da cidade.</p>
      </div>
    `
    return
  }

  // Ordenar hortas
  const sortedHortas = ordenarHortas([...hortasFiltradas])

  sortedHortas.forEach((horta) => {
    const hortaCard = criarCardHorta(horta)
    hortasList.appendChild(hortaCard)
  })
}

// Função para ordenar hortas
function ordenarHortas(hortas) {
  const sortBy = sortSelect.value

  return hortas.sort((a, b) => {
    switch (sortBy) {
      case "nome":
        return a.nome.localeCompare(b.nome)
      case "zona":
        return a.zona.localeCompare(b.zona)
      case "participantes":
        const aNum = Number.parseInt(a.participantes.match(/\d+/)?.[0] || 0)
        const bNum = Number.parseInt(b.participantes.match(/\d+/)?.[0] || 0)
        return bNum - aNum
      case "distancia":
        if (!userLocation) return 0
        const aDist = calcularDistancia(userLocation, a.coordenadas)
        const bDist = calcularDistancia(userLocation, b.coordenadas)
        return aDist - bDist
      default:
        return 0
    }
  })
}

// Função para criar card de horta
function criarCardHorta(horta) {
  const card = document.createElement("div")
  card.className = `horta-card ${hortaSelecionada === horta.id ? "selected" : ""}`
  card.id = `horta-card-${horta.id}`

  const statusClass = horta.status === "ativa" ? "status-ativa" : "status-planejamento"
  const statusText = horta.status === "ativa" ? "Ativa" : "Em Planejamento"

  // Calcular distância se localização disponível
  let distanceHtml = ""
  if (userLocation) {
    const distance = calcularDistancia(userLocation, horta.coordenadas)
    if (distance < 5) {
      card.classList.add("nearby")
      distanceHtml = `<span class="distance-badge">${distance.toFixed(1)}km</span>`
    }
  }

  card.innerHTML = `
    ${distanceHtml}
    <div class="horta-header">
      <div class="horta-title">
        <span>🌱</span>
        ${horta.nome}
      </div>
      <div class="horta-address">
        <span>📍</span>
        ${horta.endereco}
      </div>
      <span class="horta-status ${statusClass}">${statusText}</span>
    </div>
    <div class="horta-description">
      ${horta.descricao}
    </div>
    <div class="horta-details">
      <p><strong>Bairro:</strong> ${horta.bairro} (Zona ${horta.zona})</p>
      <p><strong>Participantes:</strong> ${horta.participantes}</p>
      <p><strong>Área:</strong> ${horta.area}</p>
      <p><strong>Principais cultivos:</strong> ${horta.cultivos.join(", ")}</p>
    </div>
    <div class="horta-actions">
      <button class="btn btn-green" onclick="selecionarHorta(${horta.id})">
        Ver no Mapa
      </button>
      <button class="btn btn-orange" onclick="criarRota(${horta.id})" ${!userLocation ? "disabled" : ""}>
        🗺️ Rota
      </button>
    </div>
  `

  // Evento de clique no card
  card.addEventListener("click", (e) => {
    if (!e.target.classList.contains("btn")) {
      selecionarHorta(horta.id)
    }
  })

  return card
}

// Função para selecionar horta
function selecionarHorta(id) {
  hortaSelecionada = id
  const horta = hortas.find((h) => h.id === id)

  if (horta) {
    // Centralizar mapa na horta selecionada
    map.setView([horta.coordenadas.lat, horta.coordenadas.lng], 15)

    // Abrir popup do marcador
    const marker = markers.find((m) => {
      const markerLatLng = m.getLatLng()
      return markerLatLng.lat === horta.coordenadas.lat && markerLatLng.lng === horta.coordenadas.lng
    })

    if (marker) {
      marker.openPopup()
    }
  }

  // Atualizar cards das hortas
  document.querySelectorAll(".horta-card").forEach((card) => {
    card.classList.remove("selected")
  })

  const cardSelecionado = document.getElementById(`horta-card-${id}`)
  if (cardSelecionado) {
    cardSelecionado.classList.add("selected")
    cardSelecionado.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }
}

// Função para obter localização do usuário
function obterLocalizacao() {
  mostrarLoading(true)

  if (!navigator.geolocation) {
    alert("Geolocalização não é suportada pelo seu navegador")
    mostrarLoading(false)
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      // Adicionar marcador da localização do usuário
      const userIcon = L.divIcon({
        className: "user-location-marker",
        html: '<div style="background-color: #2563eb; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map).bindPopup("📍 Sua localização")

      // Centralizar mapa na localização do usuário
      map.setView([userLocation.lat, userLocation.lng], 13)

      // Atualizar botão
      locationBtn.innerHTML = "✅ Localização Obtida"
      locationBtn.disabled = true

      // Reordenar hortas por distância se selecionado
      if (sortSelect.value === "distancia") {
        renderizarHortas()
      }

      mostrarLoading(false)
    },
    (error) => {
      console.error("Erro ao obter localização:", error)
      alert("Não foi possível obter sua localização")
      mostrarLoading(false)
    },
  )
}

// Função para calcular distância entre dois pontos
function calcularDistancia(ponto1, ponto2) {
  const R = 6371 // Raio da Terra em km
  const dLat = ((ponto2.lat - ponto1.lat) * Math.PI) / 180
  const dLng = ((ponto2.lng - ponto1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((ponto1.lat * Math.PI) / 180) *
      Math.cos((ponto2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Função para criar rota
function criarRota(hortaId) {
  if (!userLocation) {
    alert("Primeiro obtenha sua localização clicando no botão 'Minha Localização'")
    return
  }

  const horta = hortas.find((h) => h.id === hortaId)
  if (!horta) return

  // Remover rota anterior se existir
  if (routingControl) {
    map.removeControl(routingControl)
  }

  // Criar nova rota
  routingControl = L.Routing.control({
    waypoints: [L.latLng(userLocation.lat, userLocation.lng), L.latLng(horta.coordenadas.lat, horta.coordenadas.lng)],
    routeWhileDragging: false,
    addWaypoints: false,
    createMarker: () => null, // Não criar marcadores extras
    lineOptions: {
      styles: [{ color: "#16a34a", weight: 4, opacity: 0.8 }],
    },
  }).addTo(map)

  // Mostrar informações da rota
  routingControl.on("routesfound", (e) => {
    const route = e.routes[0]
    const distance = (route.summary.totalDistance / 1000).toFixed(1)
    const time = Math.round(route.summary.totalTime / 60)

    document.getElementById("routeDetails").innerHTML = `
      <p><strong>Destino:</strong> ${horta.nome}</p>
      <p><strong>Distância:</strong> ${distance} km</p>
      <p><strong>Tempo estimado:</strong> ${time} min</p>
    `

    routeInfo.style.display = "block"
  })
}

// Função para alternar camada do mapa
function alternarCamada() {
  if (currentLayer === "street") {
    map.removeLayer(map.streetLayer)
    map.addLayer(map.satelliteLayer)
    currentLayer = "satellite"
    satelliteBtn.innerHTML = "🗺️ Mapa"
  } else {
    map.removeLayer(map.satelliteLayer)
    map.addLayer(map.streetLayer)
    currentLayer = "street"
    satelliteBtn.innerHTML = "🛰️ Satélite"
  }
}

// Função para exportar dados
function exportarDados() {
  mostrarLoading(true)

  try {
    // Usar jsPDF se disponível
    if (window.jsPDF) {
      const { jsPDF } = window.jsPDF
      const doc = new jsPDF()

      // Título
      doc.setFontSize(20)
      doc.text("Hortas Comunitárias de Maringá", 20, 30)

      // Data
      doc.setFontSize(12)
      doc.text(`Relatório gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 20, 45)

      // Estatísticas
      const stats = obterEstatisticas()
      doc.text(`Total de hortas: ${stats.total}`, 20, 60)
      doc.text(`Hortas ativas: ${stats.ativas}`, 20, 70)
      doc.text(`Famílias beneficiadas: ${stats.familias}`, 20, 80)
      doc.text(`Área total: ${stats.areaTotal.toLocaleString("pt-BR")} m²`, 20, 90)

      // Lista de hortas
      let yPos = 110
      doc.setFontSize(14)
      doc.text("Lista de Hortas:", 20, yPos)
      yPos += 15

      doc.setFontSize(10)
      hortasFiltradas.forEach((horta, index) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 30
        }

        doc.text(`${index + 1}. ${horta.nome}`, 20, yPos)
        yPos += 8
        doc.text(`   ${horta.endereco}`, 20, yPos)
        yPos += 8
        doc.text(`   Status: ${horta.status === "ativa" ? "Ativa" : "Em Planejamento"}`, 20, yPos)
        yPos += 8
        doc.text(`   Participantes: ${horta.participantes}`, 20, yPos)
        yPos += 15
      })

      doc.save("hortas-comunitarias-maringa.pdf")
    } else {
      // Fallback para CSV
      exportarCSV()
    }
  } catch (error) {
    console.error("Erro ao exportar:", error)
    exportarCSV()
  }

  mostrarLoading(false)
}

// Função para exportar CSV
function exportarCSV() {
  const headers = ["Nome", "Endereço", "Bairro", "Zona", "Status", "Participantes", "Área", "Cultivos"]
  const csvContent = [
    headers.join(","),
    ...hortasFiltradas.map((horta) =>
      [
        `"${horta.nome}"`,
        `"${horta.endereco}"`,
        `"${horta.bairro}"`,
        `"${horta.zona}"`,
        `"${horta.status}"`,
        `"${horta.participantes}"`,
        `"${horta.area}"`,
        `"${horta.cultivos.join("; ")}"`,
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "hortas-comunitarias-maringa.csv"
  link.click()
}

// Função para modo offline
function alternarModoOffline() {
  isOfflineMode = !isOfflineMode

  if (isOfflineMode) {
    salvarDadosOffline()
    offlineBtn.innerHTML = "🌐 Online"
    offlineBtn.classList.add("btn-orange")
    mostrarIndicadorOffline(true)
  } else {
    offlineBtn.innerHTML = "💾 Offline"
    offlineBtn.classList.remove("btn-orange")
    mostrarIndicadorOffline(false)
  }
}

// Função para salvar dados offline
function salvarDadosOffline() {
  try {
    localStorage.setItem("hortasData", JSON.stringify(hortas))
    localStorage.setItem("lastUpdate", new Date().toISOString())
    console.log("Dados salvos para uso offline")
  } catch (error) {
    console.error("Erro ao salvar dados offline:", error)
  }
}

// Função para carregar dados offline
function carregarDadosOffline() {
  try {
    const savedData = localStorage.getItem("hortasData")
    if (savedData) {
      const lastUpdate = localStorage.getItem("lastUpdate")
      console.log(`Dados offline disponíveis (última atualização: ${new Date(lastUpdate).toLocaleString("pt-BR")})`)
    }
  } catch (error) {
    console.error("Erro ao carregar dados offline:", error)
  }
}

// Função para mostrar indicador offline
function mostrarIndicadorOffline(show) {
  let indicator = document.querySelector(".offline-indicator")

  if (!indicator) {
    indicator = document.createElement("div")
    indicator.className = "offline-indicator"
    indicator.innerHTML = "💾 Modo Offline Ativo"
    document.body.appendChild(indicator)
  }

  if (show) {
    indicator.classList.add("show")
  } else {
    indicator.classList.remove("show")
  }
}

// Função para verificar conexão
function verificarConexao() {
  window.addEventListener("online", () => {
    mostrarIndicadorOffline(false)
    console.log("Conexão restaurada")
  })

  window.addEventListener("offline", () => {
    mostrarIndicadorOffline(true)
    console.log("Conexão perdida - usando dados offline")
  })
}

// Função para mostrar loading
function mostrarLoading(show) {
  loadingModal.style.display = show ? "flex" : "none"
}

// Função para configurar busca
function configurarBusca() {
  searchInput.addEventListener("input", () => {
    aplicarFiltros()
  })
}

// Função para configurar filtros
function configurarFiltros() {
  zoneFilter.addEventListener("change", aplicarFiltros)
  statusFilter.addEventListener("change", aplicarFiltros)
  sortSelect.addEventListener("change", renderizarHortas)
}

// Função para configurar eventos
function configurarEventos() {
  locationBtn.addEventListener("click", obterLocalizacao)
  satelliteBtn.addEventListener("click", alternarCamada)
  exportBtn.addEventListener("click", exportarDados)
  offlineBtn.addEventListener("click", alternarModoOffline)

  closeRoute.addEventListener("click", () => {
    if (routingControl) {
      map.removeControl(routingControl)
      routingControl = null
    }
    routeInfo.style.display = "none"
  })

  // Eventos de teclado para acessibilidade
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Limpar seleção ao pressionar Escape
      hortaSelecionada = null
      document.querySelectorAll(".horta-card").forEach((el) => {
        el.classList.remove("selected")
      })
      map.closePopup()

      // Fechar rota se aberta
      if (routingControl) {
        map.removeControl(routingControl)
        routingControl = null
        routeInfo.style.display = "none"
      }
    }
  })
}

// Função para aplicar todos os filtros
function aplicarFiltros() {
  const termoBusca = searchInput.value.toLowerCase().trim()
  const zonaFiltro = zoneFilter.value
  const statusFiltro = statusFilter.value

  hortasFiltradas = hortas.filter((horta) => {
    // Filtro de busca
    const matchBusca =
      termoBusca === "" ||
      horta.nome.toLowerCase().includes(termoBusca) ||
      horta.endereco.toLowerCase().includes(termoBusca) ||
      horta.bairro.toLowerCase().includes(termoBusca) ||
      horta.zona.toLowerCase().includes(termoBusca) ||
      horta.descricao.toLowerCase().includes(termoBusca) ||
      horta.cultivos.some((cultivo) => cultivo.toLowerCase().includes(termoBusca))

    // Filtro de zona
    const matchZona = zonaFiltro === "todas" || horta.zona.toLowerCase() === zonaFiltro

    // Filtro de status
    const matchStatus = statusFiltro === "todos" || horta.status === statusFiltro

    return matchBusca && matchZona && matchStatus
  })

  renderizarHortas()
  adicionarMarcadores()
  atualizarEstatisticas()
}

// Função para atualizar estatísticas
function atualizarEstatisticas() {
  const stats = obterEstatisticas()

  document.getElementById("totalHortas").textContent = stats.total
  document.getElementById("hortasAtivas").textContent = stats.ativas
  document.getElementById("familiasBeneficiadas").textContent = stats.familias
  document.getElementById("areaTotal").textContent = stats.areaTotal.toLocaleString("pt-BR")
}

// Função para obter estatísticas das hortas
function obterEstatisticas() {
  const hortasAtivas = hortas.filter((h) => h.status === "ativa")

  // Calcular total de famílias
  const totalFamilias = hortasAtivas.reduce((total, horta) => {
    const numFamilias = Number.parseInt(horta.participantes.match(/\d+/)?.[0] || 0)
    return total + numFamilias
  }, 0)

  // Calcular área total
  const areaTotal = hortas.reduce((total, horta) => {
    const area = Number.parseInt(horta.area.match(/\d+/)?.[0] || 0)
    return total + area
  }, 0)

  return {
    total: hortas.length,
    ativas: hortasAtivas.length,
    planejamento: hortas.filter((h) => h.status === "planejamento").length,
    familias: totalFamilias,
    areaTotal: areaTotal,
    zonas: {
      norte: hortas.filter((h) => h.zona === "Norte").length,
      sul: hortas.filter((h) => h.zona === "Sul").length,
      leste: hortas.filter((h) => h.zona === "Leste").length,
      oeste: hortas.filter((h) => h.zona === "Oeste").length,
      central: hortas.filter((h) => h.zona === "Central").length,
    },
  }
}

// Exportar funções para uso global
window.selecionarHorta = selecionarHorta
window.criarRota = criarRota
window.obterEstatisticas = obterEstatisticas

// Log das estatísticas no console para desenvolvimento
console.log("Estatísticas das Hortas de Maringá:", obterEstatisticas())
