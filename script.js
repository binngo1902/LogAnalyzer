class LogAnalyzer {
  constructor() {
    this.logData = []
    this.filteredLogData = []
    this.charts = {}
    this.botPatterns = this.initializeBotPatterns()
    this.initializeEventListeners()
  }

  initializeBotPatterns() {
    return {
      seo: [
        { name: "Googlebot", pattern: /googlebot/i, company: "Google" },
        { name: "Bingbot", pattern: /bingbot/i, company: "Microsoft" },
        { name: "Slurp", pattern: /slurp/i, company: "Yahoo" },
        { name: "DuckDuckBot", pattern: /duckduckbot/i, company: "DuckDuckGo" },
        { name: "Baiduspider", pattern: /baiduspider/i, company: "Baidu" },
        { name: "YandexBot", pattern: /yandexbot/i, company: "Yandex" },
        { name: "Sogou", pattern: /sogou/i, company: "Sogou" },
        { name: "Exabot", pattern: /exabot/i, company: "Exalead" },
        { name: "facebookexternalhit", pattern: /facebookexternalhit/i, company: "Facebook" },
        { name: "Twitterbot", pattern: /twitterbot/i, company: "Twitter" },
        { name: "LinkedInBot", pattern: /linkedinbot/i, company: "LinkedIn" },
        { name: "WhatsApp", pattern: /whatsapp/i, company: "WhatsApp" },
        { name: "Applebot", pattern: /applebot/i, company: "Apple" },
        { name: "MJ12bot", pattern: /mj12bot/i, company: "Majestic" },
        { name: "AhrefsBot", pattern: /ahrefsbot/i, company: "Ahrefs" },
        { name: "SemrushBot", pattern: /semrushbot/i, company: "Semrush" },
        { name: "MozBot", pattern: /rogerbot|dotbot/i, company: "Moz" },
      ],
      ai: [
        { name: "GPTBot", pattern: /gptbot/i, company: "OpenAI" },
        { name: "ChatGPT-User", pattern: /chatgpt-user/i, company: "OpenAI" },
        { name: "CCBot", pattern: /ccbot/i, company: "Common Crawl" },
        { name: "Claude-Web", pattern: /claude-web/i, company: "Anthropic" },
        { name: "PerplexityBot", pattern: /perplexitybot/i, company: "Perplexity" },
        { name: "YouBot", pattern: /youbot/i, company: "You.com" },
        { name: "AI2Bot", pattern: /ai2bot/i, company: "AI2" },
        { name: "ImagesiftBot", pattern: /imagesiftbot/i, company: "ImageSift" },
        { name: "Omgilibot", pattern: /omgilibot/i, company: "Omgili" },
        { name: "Bytespider", pattern: /bytespider/i, company: "ByteDance" },
        { name: "MetaExternalAgent ", pattern: /meta-externalagent/i, company: "Meta" },
      ],
      social: [
        { name: "FacebookBot", pattern: /facebookbot/i, company: "Facebook" },
        { name: "Instagram", pattern: /instagram/i, company: "Instagram" },
        { name: "TelegramBot", pattern: /telegrambot/i, company: "Telegram" },
        { name: "SkypeUriPreview", pattern: /skypeuripreview/i, company: "Skype" },
        { name: "SlackBot", pattern: /slackbot/i, company: "Slack" },
        { name: "DiscordBot", pattern: /discordbot/i, company: "Discord" },
        { name: "RedditBot", pattern: /redditbot/i, company: "Reddit" },
        { name: "PinterestBot", pattern: /pinterestbot/i, company: "Pinterest" },
      ],
      monitoring: [
        { name: "UptimeRobot", pattern: /uptimerobot/i, company: "UptimeRobot" },
        { name: "Pingdom", pattern: /pingdom/i, company: "Pingdom" },
        { name: "StatusCake", pattern: /statuscake/i, company: "StatusCake" },
        { name: "Site24x7", pattern: /site24x7/i, company: "Site24x7" },
        { name: "GTmetrix", pattern: /gtmetrix/i, company: "GTmetrix" },
        { name: "PageSpeed", pattern: /pagespeed/i, company: "Google PageSpeed" },
      ],
      security: [
        { name: "Nessus", pattern: /nessus/i, company: "Tenable" },
        { name: "Nikto", pattern: /nikto/i, company: "Nikto" },
        { name: "Nmap", pattern: /nmap/i, company: "Nmap" },
        { name: "Qualys", pattern: /qualys/i, company: "Qualys" },
        { name: "OpenVAS", pattern: /openvas/i, company: "OpenVAS" },
        { name: "ZAP", pattern: /zap/i, company: "OWASP ZAP" },
      ],
      other: [
        { name: "Wget", pattern: /wget/i, company: "GNU Wget" },
        { name: "Curl", pattern: /curl/i, company: "cURL" },
        { name: "Python-requests", pattern: /python-requests/i, company: "Python" },
        { name: "Go-http-client", pattern: /go-http-client/i, company: "Go" },
        { name: "Java", pattern: /java/i, company: "Java" },
        { name: "Node.js", pattern: /node/i, company: "Node.js" },
        { name: "Scrapy", pattern: /scrapy/i, company: "Scrapy" },
        { name: "Headless Chrome", pattern: /headlesschrome/i, company: "Chrome" },
        { name: "DownNotifier", pattern: /downnotifier/i, company: "DownNotifier" },
        { name: "BetterUptime", pattern: /betteruptime|better uptime/i, company: "Better Uptime" },
        { name: "HubSpotPageFetcher", pattern: /hubspotpagefetcher|HubSpot Page Fetcher/i, company: "HubSpot" },
      ],
    }
  }

  initializeEventListeners() {
    const fileInput = document.getElementById("logFile")
    const analyzeBtn = document.getElementById("analyzeBtn")
    const dropbox = document.getElementById("dropbox")
    const removeFileBtn = document.getElementById("removeFile")

    // Date range controls
    const applyDateRangeBtn = document.getElementById("applyDateRange")
    const resetDateRangeBtn = document.getElementById("resetDateRange")
    const quickFilterBtns = document.querySelectorAll(".quick-filter-btn")

    // File input change handler
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleFileSelection(e.target.files[0])
      }
    })

    // Dropbox click handler
    dropbox.addEventListener("click", (e) => {
      if (!e.target.closest(".remove-file")) {
        fileInput.click()
      }
    })

    // Drag and drop handlers
    dropbox.addEventListener("dragover", (e) => {
      e.preventDefault()
      dropbox.classList.add("dragover")
    })

    dropbox.addEventListener("dragleave", (e) => {
      e.preventDefault()
      dropbox.classList.remove("dragover")
    })

    dropbox.addEventListener("drop", (e) => {
      e.preventDefault()
      dropbox.classList.remove("dragover")

      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        // Check if it's a valid file type
        if (file.type === "text/plain" || file.name.endsWith(".log") || file.name.endsWith(".txt")) {
          fileInput.files = files
          this.handleFileSelection(file)
        } else {
          alert("Please select a valid log file (.log or .txt)")
        }
      }
    })

    // Remove file handler
    removeFileBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      this.clearFileSelection()
    })

    // Analyze button handler
    analyzeBtn.addEventListener("click", () => {
      this.analyzeLogFile()
    })

    // Date range event listeners
    applyDateRangeBtn.addEventListener("click", () => {
      this.applyDateFilter()
    })

    resetDateRangeBtn.addEventListener("click", () => {
      this.resetDateFilter()
    })

    quickFilterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const days = Number.parseInt(e.target.dataset.days)
        this.applyQuickFilter(days)
      })
    })
  }

  handleFileSelection(file) {
    const dropboxContent = document.querySelector(".dropbox-content")
    const fileInfo = document.getElementById("fileInfo")
    const fileName = document.getElementById("fileName")
    const fileSize = document.getElementById("fileSize")
    const analyzeBtn = document.getElementById("analyzeBtn")

    // Hide dropbox content and show file info
    dropboxContent.classList.add("hidden")
    fileInfo.classList.remove("hidden")

    // Update file details
    fileName.textContent = file.name
    fileSize.textContent = this.formatFileSize(file.size)

    // Enable analyze button
    analyzeBtn.disabled = false
  }

  clearFileSelection() {
    const fileInput = document.getElementById("logFile")
    const dropboxContent = document.querySelector(".dropbox-content")
    const fileInfo = document.getElementById("fileInfo")
    const analyzeBtn = document.getElementById("analyzeBtn")

    // Clear file input
    fileInput.value = ""

    // Show dropbox content and hide file info
    dropboxContent.classList.remove("hidden")
    fileInfo.classList.add("hidden")

    // Disable analyze button
    analyzeBtn.disabled = true
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  async analyzeLogFile() {
    const fileInput = document.getElementById("logFile")
    const file = fileInput.files[0]

    if (!file) return

    this.showLoading(true)

    try {
      const text = await this.readFile(file)
      this.logData = this.parseLogFile(text)
      this.displayResults()
    } catch (error) {
      console.error("Error analyzing log file:", error)
      alert("Error analyzing log file. Please check the file format.")
    } finally {
      this.showLoading(false)
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  parseLogFile(text) {
    // Split by IP address pattern to handle concatenated entries
    const logRegex = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) ([^"]*) HTTP\/[\d.]+" (\d+) (\d+|-) "([^"]*)" "([^"]*)"/gm
    const logEntries = []

    let match
    while ((match = logRegex.exec(text)) !== null) {
      const [, ip, timestamp, method, url, status, size, referer, userAgent] = match

      // Parse timestamp - handle both formats: +0000 and -0400
      let parsedDate
      try {
        // Handle format: 15/Oct/2019:19:41:46 +0000 or 13/Jul/2015:07:18:58 -0400
        const timestampStr = timestamp.replace(
          /(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-]\d{4})/,
          "$1 $2 $3 $4:$5:$6",
        )

        const months = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        }

        const [day, monthStr, year, time] = timestampStr.split(" ")
        const [hour, minute, second] = time.split(":")
        parsedDate = new Date(
          Number.parseInt(year),
          months[monthStr],
          Number.parseInt(day),
          Number.parseInt(hour),
          Number.parseInt(minute),
          Number.parseInt(second),
        )
      } catch (error) {
        console.warn("Failed to parse timestamp:", timestamp)
        parsedDate = new Date()
      }

      // Detect bot information
      const botInfo = this.detectBot(userAgent)
      if (botInfo.name === "Unknown Bot") {
        console.log(`Unknown bot detected: ${userAgent}`)
      }
      logEntries.push({
        ip,
        timestamp: parsedDate,
        method,
        url: url || "/",
        status: Number.parseInt(status),
        size: size === "-" ? 0 : Number.parseInt(size),
        referer,
        userAgent,
        botInfo,
      })
    }

    return logEntries
  }

  detectBot(userAgent) {
    // First check specific bot patterns
    for (const [type, bots] of Object.entries(this.botPatterns)) {
      for (const bot of bots) {
        if (bot.pattern.test(userAgent)) {
          return {
            isBot: true,
            name: bot.name,
            type: type,
            company: bot.company,
          }
        }
      }
    }

    // Check for generic bot indicators with more patterns
    const genericBotPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /fetcher/i,
      /monitor/i,
      /checker/i,
      /validator/i,
      /indexer/i,
    ]

    for (const pattern of genericBotPatterns) {
      if (pattern.test(userAgent)) {
        // Try to extract bot name from user agent
        const botNameMatch = userAgent.match(/(\w+bot|\w+spider|\w+crawler)/i)
        const botName = botNameMatch ? botNameMatch[1] : "Unknown Bot"
      
        return {
          isBot: true,
          name: botName,
          type: "other",
          company: "Unknown",
        }
      }
    }

    return {
      isBot: false,
      name: null,
      type: null,
      company: null,
    }
  }

  displayResults() {
    // Destroy existing charts before creating new ones
    this.destroyExistingCharts()

    // Setup date range controls
    this.setupDateRange()

    this.calculateStatistics()
    this.calculateBotStatistics()
    this.createDetailedBotAnalysis()
    this.createCharts()
    this.createBotCharts()
    this.createTables()
    this.createBotTable()
    document.getElementById("results").classList.remove("hidden")
  }

  calculateStatistics() {
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData
    const uniqueUrls = new Set(data.map((entry) => entry.url))
    const uniqueIps = new Set(data.map((entry) => entry.ip))

    // Calculate date range
    const dates = data.map((entry) => entry.timestamp)
    const minDate = new Date(Math.min(...dates))
    const maxDate = new Date(Math.max(...dates))
    const daysDiff = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)))

    // Status code counts
    const statusCodes = data.reduce((acc, entry) => {
      const statusClass = Math.floor(entry.status / 100)
      acc[statusClass] = (acc[statusClass] || 0) + 1
      return acc
    }, {})

    const totalBytes = data.reduce((sum, entry) => sum + entry.size, 0)
    const totalEvents = data.length

    // Update DOM
    document.getElementById("uniqueUrls").textContent = uniqueUrls.size.toLocaleString()
    document.getElementById("uniqueUrlsPerDay").textContent = Math.round(uniqueUrls.size / daysDiff)
    document.getElementById("totalEvents").textContent = totalEvents.toLocaleString()
    document.getElementById("eventsPerDay").textContent = Math.round(totalEvents / daysDiff).toLocaleString()
    document.getElementById("totalBytes").textContent = this.formatBytes(totalBytes)
    document.getElementById("avgBytes").textContent = this.formatBytes(Math.round(totalBytes / totalEvents))
    document.getElementById("bytesPerDay").textContent = this.formatBytes(Math.round(totalBytes / daysDiff))
    document.getElementById("successCount").textContent = (statusCodes[2] || 0).toLocaleString()
    document.getElementById("redirectionCount").textContent = (statusCodes[3] || 0).toLocaleString()
    document.getElementById("clientErrorCount").textContent = (statusCodes[4] || 0).toLocaleString()
    document.getElementById("serverErrorCount").textContent = (statusCodes[5] || 0).toLocaleString()
    document.getElementById("errorCount").textContent = ((statusCodes[4] || 0) + (statusCodes[5] || 0)).toLocaleString()
  }

  calculateBotStatistics() {
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData
    const botRequests = data.filter((entry) => entry.botInfo.isBot)
    const humanRequests = data.filter((entry) => !entry.botInfo.isBot)
    const totalRequests = data.length

    const uniqueBots = new Set(botRequests.map((entry) => entry.botInfo.name)).size

    // Update DOM
    document.getElementById("totalBotRequests").textContent = botRequests.length.toLocaleString()
    document.getElementById("botTrafficPercentage").textContent =
      totalRequests > 0 ? ((botRequests.length / totalRequests) * 100).toFixed(1) + "%" : "0%"
    document.getElementById("uniqueBots").textContent = uniqueBots.toLocaleString()
    document.getElementById("humanTrafficPercentage").textContent =
      totalRequests > 0 ? ((humanRequests.length / totalRequests) * 100).toFixed(1) + "%" : "0%"
  }

  createDetailedBotAnalysis() {
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData
    const botRequests = data.filter((entry) => entry.botInfo.isBot)
    const totalRequests = data.length

    // Group bots by type and count requests
    const botsByType = {}
    const botStats = {}

    botRequests.forEach((entry) => {
      const { name, type, company } = entry.botInfo

      if (!botsByType[type]) {
        botsByType[type] = 0
      }
      botsByType[type]++

      if (!botStats[name]) {
        botStats[name] = {
          name,
          type,
          company,
          count: 0,
        }
      }
      botStats[name].count++
    })

    // Update category counts
    document.getElementById("seoBotsCount").textContent = `${(botsByType.seo || 0).toLocaleString()} requests`
    document.getElementById("aiBotsCount").textContent = `${(botsByType.ai || 0).toLocaleString()} requests`
    document.getElementById("socialBotsCount").textContent = `${(botsByType.social || 0).toLocaleString()} requests`
    document.getElementById("monitoringBotsCount").textContent =
      `${(botsByType.monitoring || 0).toLocaleString()} requests`
    document.getElementById("securityBotsCount").textContent = `${(botsByType.security || 0).toLocaleString()} requests`
    document.getElementById("otherBotsCount").textContent = `${(botsByType.other || 0).toLocaleString()} requests`

    // Populate bot lists for each category
    this.populateBotList("seo", botStats, totalRequests)
    this.populateBotList("ai", botStats, totalRequests)
    this.populateBotList("social", botStats, totalRequests)
    this.populateBotList("monitoring", botStats, totalRequests)
    this.populateBotList("security", botStats, totalRequests)
    this.populateBotList("other", botStats, totalRequests)
  }

  populateBotList(type, botStats, totalRequests) {
    const listElement = document.getElementById(`${type}BotsList`)
    listElement.innerHTML = ""

    // Filter bots by type and sort by count
    const botsOfType = Object.values(botStats)
      .filter((bot) => bot.type === type)
      .sort((a, b) => b.count - a.count)

    if (botsOfType.length === 0) {
      listElement.innerHTML = '<div class="empty-category">No bots detected in this category</div>'
      return
    }

    botsOfType.forEach((bot) => {
      const percentage = ((bot.count / totalRequests) * 100).toFixed(2)

      const botItem = document.createElement("div")
      botItem.className = "bot-item"
      botItem.innerHTML = `
        <div class="bot-info">
          <div class="bot-name">${bot.name}</div>
          <div class="bot-company">${bot.company}</div>
        </div>
        <div class="bot-stats">
          <div class="bot-requests">${bot.count.toLocaleString()} requests</div>
          <div class="bot-percentage">${percentage}%</div>
        </div>
      `

      listElement.appendChild(botItem)
    })
  }

  destroyExistingCharts() {
    // Destroy all existing charts
    Object.keys(this.charts).forEach((chartKey) => {
      if (this.charts[chartKey]) {
        this.charts[chartKey].destroy()
        delete this.charts[chartKey]
      }
    })
  }

  createCharts() {
    this.createResponseCodesChart()
    this.createEventsChart()
    this.createUrlsChart()
  }

  createBotCharts() {
    this.createBotActivityChart()
    this.createBotDistributionChart()
  }

  createBotActivityChart() {
    const ctx = document.getElementById("botActivityChart").getContext("2d")
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData

    const dailyData = this.groupByDate(data)
    const dates = Object.keys(dailyData).sort()

    const datasets = [
      {
        label: "Human Traffic",
        data: dates.map((date) => dailyData[date].filter((entry) => !entry.botInfo.isBot).length),
        borderColor: "#27ae60",
        backgroundColor: "rgba(39, 174, 96, 0.1)",
        tension: 0.4,
      },
      {
        label: "Bot Traffic",
        data: dates.map((date) => dailyData[date].filter((entry) => entry.botInfo.isBot).length),
        borderColor: "#e74c3c",
        backgroundColor: "rgba(231, 76, 60, 0.1)",
        tension: 0.4,
      },
    ]

    this.charts.botActivity = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates.map((date) => this.formatDate(new Date(date))),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  createBotDistributionChart() {
    const ctx = document.getElementById("botDistributionChart").getContext("2d")
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData

    const botRequests = data.filter((entry) => entry.botInfo.isBot)
    const botCounts = botRequests.reduce((acc, entry) => {
      acc[entry.botInfo.name] = (acc[entry.botInfo.name] || 0) + 1
      return acc
    }, {})

    const topBots = Object.entries(botCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#FF6384",
      "#C9CBCF",
      "#4BC0C0",
      "#FF6384",
    ]

    this.charts.botDistribution = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: topBots.map(([name]) => name),
        datasets: [
          {
            data: topBots.map(([, count]) => count),
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
        },
      },
    })
  }

  createResponseCodesChart() {
    const ctx = document.getElementById("responseCodesChart").getContext("2d")
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData

    // Group data by date and status code
    const dailyData = this.groupByDate(data)
    const dates = Object.keys(dailyData).sort()

    const datasets = [
      {
        label: "Success (2xx)",
        data: dates.map((date) => dailyData[date].filter((entry) => Math.floor(entry.status / 100) === 2).length),
        borderColor: "#27ae60",
        backgroundColor: "rgba(39, 174, 96, 0.1)",
        tension: 0.4,
      },
      {
        label: "Redirection (3xx)",
        data: dates.map((date) => dailyData[date].filter((entry) => Math.floor(entry.status / 100) === 3).length),
        borderColor: "#f39c12",
        backgroundColor: "rgba(243, 156, 18, 0.1)",
        tension: 0.4,
      },
      {
        label: "Client Error (4xx)",
        data: dates.map((date) => dailyData[date].filter((entry) => Math.floor(entry.status / 100) === 4).length),
        borderColor: "#e74c3c",
        backgroundColor: "rgba(231, 76, 60, 0.1)",
        tension: 0.4,
      },
      {
        label: "Server Error (5xx)",
        data: dates.map((date) => dailyData[date].filter((entry) => Math.floor(entry.status / 100) === 5).length),
        borderColor: "#8e44ad",
        backgroundColor: "rgba(142, 68, 173, 0.1)",
        tension: 0.4,
      },
    ]

    this.charts.responseCodes = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates.map((date) => this.formatDate(new Date(date))),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  createEventsChart() {
    const ctx = document.getElementById("eventsChart").getContext("2d")
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData

    const dailyData = this.groupByDate(data)
    const dates = Object.keys(dailyData).sort()

    this.charts.events = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates.map((date) => this.formatDate(new Date(date))),
        datasets: [
          {
            label: "Total Events",
            data: dates.map((date) => dailyData[date].length),
            borderColor: "#3498db",
            backgroundColor: "rgba(52, 152, 219, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }

  createUrlsChart() {
    const ctx = document.getElementById("urlsChart").getContext("2d")
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData

    // Get top 10 URLs
    const urlCounts = data.reduce((acc, entry) => {
      acc[entry.url] = (acc[entry.url] || 0) + 1
      return acc
    }, {})

    const topUrls = Object.entries(urlCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    this.charts.urls = new Chart(ctx, {
      type: "bar",
      data: {
        labels: topUrls.map(([url]) => (url.length > 30 ? url.substring(0, 30) + "..." : url)),
        datasets: [
          {
            label: "Requests",
            data: topUrls.map(([, count]) => count),
            backgroundColor: "rgba(52, 152, 219, 0.8)",
            borderColor: "#3498db",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            ticks: {
              maxRotation: 45,
            },
          },
        },
      },
    })
  }

  createTables() {
    this.createTopUrlsTable()
    this.createTopIpsTable()
  }

  createBotTable() {
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData
    const botRequests = data.filter((entry) => entry.botInfo.isBot)
    const botStats = botRequests.reduce((acc, entry) => {
      const key = entry.botInfo.name
      if (!acc[key]) {
        acc[key] = {
          name: entry.botInfo.name,
          type: entry.botInfo.type,
          company: entry.botInfo.company,
          count: 0,
          lastSeen: entry.timestamp,
        }
      }
      acc[key].count++
      if (entry.timestamp > acc[key].lastSeen) {
        acc[key].lastSeen = entry.timestamp
      }
      return acc
    }, {})

    const sortedBots = Object.values(botStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 50)

    const tbody = document.querySelector("#botDetailsTable tbody")
    tbody.innerHTML = ""

    const total = data.length

    sortedBots.forEach((bot) => {
      const row = tbody.insertRow()
      const typeClass = `bot-type-${bot.type}`
      row.innerHTML = `
        <td><strong>${bot.name}</strong><br><small>${bot.company}</small></td>
        <td><span class="${typeClass}">${bot.type.toUpperCase()}</span></td>
        <td>${bot.count.toLocaleString()}</td>
        <td class="percentage">${((bot.count / total) * 100).toFixed(2)}%</td>
        <td>${bot.lastSeen.toLocaleDateString()} ${bot.lastSeen.toLocaleTimeString()}</td>
      `
    })
  }

  createTopUrlsTable() {
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData
    const urlCounts = data.reduce((acc, entry) => {
      acc[entry.url] = (acc[entry.url] || 0) + 1
      return acc
    }, {})

    const topUrls = Object.entries(urlCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)

    const tbody = document.querySelector("#topUrlsTable tbody")
    tbody.innerHTML = ""

    const total = data.length

    topUrls.forEach(([url, count]) => {
      const row = tbody.insertRow()
      row.innerHTML = `
                <td title="${url}">${url.length > 50 ? url.substring(0, 50) + "..." : url}</td>
                <td>${count.toLocaleString()}</td>
                <td class="percentage">${((count / total) * 100).toFixed(2)}%</td>
            `
    })
  }

  createTopIpsTable() {
    const data = this.filteredLogData.length > 0 ? this.filteredLogData : this.logData
    const ipCounts = data.reduce((acc, entry) => {
      acc[entry.ip] = (acc[entry.ip] || 0) + 1
      return acc
    }, {})

    const topIps = Object.entries(ipCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)

    const tbody = document.querySelector("#topIpsTable tbody")
    tbody.innerHTML = ""

    const total = data.length

    topIps.forEach(([ip, count]) => {
      const row = tbody.insertRow()
      row.innerHTML = `
                <td>${ip}</td>
                <td>${count.toLocaleString()}</td>
                <td class="percentage">${((count / total) * 100).toFixed(2)}%</td>
            `
    })
  }

  groupByDate(data) {
    return data.reduce((acc, entry) => {
      const date = entry.timestamp.toISOString().split("T")[0]
      if (!acc[date]) acc[date] = []
      acc[date].push(entry)
      return acc
    }, {})
  }

  formatDate(date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  showLoading(show) {
    const loading = document.getElementById("loadingIndicator")
    const results = document.getElementById("results")

    if (show) {
      loading.classList.remove("hidden")
      results.classList.add("hidden")
      // Clear previous data when starting new analysis
      this.destroyExistingCharts()
    } else {
      loading.classList.add("hidden")
    }
  }

  setupDateRange() {
    if (this.logData.length === 0) return

    const dates = this.logData.map((entry) => entry.timestamp)
    const minDate = new Date(Math.min(...dates))
    const maxDate = new Date(Math.max(...dates))

    const startDateInput = document.getElementById("startDate")
    const endDateInput = document.getElementById("endDate")

    // Set min and max values for date inputs
    startDateInput.min = this.formatDateForInput(minDate)
    startDateInput.max = this.formatDateForInput(maxDate)
    endDateInput.min = this.formatDateForInput(minDate)
    endDateInput.max = this.formatDateForInput(maxDate)

    // Set default values to full range
    startDateInput.value = this.formatDateForInput(minDate)
    endDateInput.value = this.formatDateForInput(maxDate)

    // Update info display
    document.getElementById("totalLogEntries").textContent = `${this.logData.length.toLocaleString()} total entries`
    document.getElementById("dateRangeSpan").textContent =
      `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`

    // Show date range section
    document.getElementById("dateRangeSection").classList.remove("hidden")

    // Initialize filtered data with all data
    this.filteredLogData = [...this.logData]
  }

  formatDateForInput(date) {
    return date.toISOString().split("T")[0]
  }

  applyDateFilter() {
    const startDate = new Date(document.getElementById("startDate").value)
    const endDate = new Date(document.getElementById("endDate").value)

    // Set end date to end of day
    endDate.setHours(23, 59, 59, 999)

    if (startDate > endDate) {
      alert("Start date cannot be after end date")
      return
    }

    // Filter data
    this.filteredLogData = this.logData.filter((entry) => {
      return entry.timestamp >= startDate && entry.timestamp <= endDate
    })

    // Update filtered info
    this.updateFilteredInfo(startDate, endDate)

    // Clear active quick filter buttons
    document.querySelectorAll(".quick-filter-btn").forEach((btn) => {
      btn.classList.remove("active")
    })

    // Refresh displays with filtered data
    this.refreshDisplayWithFilteredData()
  }

  applyQuickFilter(days) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days + 1)
    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    // Update date inputs
    document.getElementById("startDate").value = this.formatDateForInput(startDate)
    document.getElementById("endDate").value = this.formatDateForInput(endDate)

    // Filter data
    this.filteredLogData = this.logData.filter((entry) => {
      return entry.timestamp >= startDate && entry.timestamp <= endDate
    })

    // Update filtered info
    this.updateFilteredInfo(startDate, endDate)

    // Update active button
    document.querySelectorAll(".quick-filter-btn").forEach((btn) => {
      btn.classList.remove("active")
    })
    event.target.classList.add("active")

    // Refresh displays with filtered data
    this.refreshDisplayWithFilteredData()
  }

  resetDateFilter() {
    // Reset to full range
    this.filteredLogData = [...this.logData]

    // Reset date inputs to full range
    const dates = this.logData.map((entry) => entry.timestamp)
    const minDate = new Date(Math.min(...dates))
    const maxDate = new Date(Math.max(...dates))

    document.getElementById("startDate").value = this.formatDateForInput(minDate)
    document.getElementById("endDate").value = this.formatDateForInput(maxDate)

    // Hide filtered info
    document.getElementById("filteredInfo").classList.add("hidden")

    // Clear active quick filter buttons
    document.querySelectorAll(".quick-filter-btn").forEach((btn) => {
      btn.classList.remove("active")
    })

    // Refresh displays with all data
    this.refreshDisplayWithFilteredData()
  }

  updateFilteredInfo(startDate, endDate) {
    const filteredInfo = document.getElementById("filteredInfo")
    const filteredEntries = document.getElementById("filteredEntries")
    const filteredDateRange = document.getElementById("filteredDateRange")

    filteredEntries.textContent = `${this.filteredLogData.length.toLocaleString()} entries`
    filteredDateRange.textContent = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`

    filteredInfo.classList.remove("hidden")
  }

  refreshDisplayWithFilteredData() {
    // Destroy existing charts
    this.destroyExistingCharts()

    // Recalculate everything with filtered data
    this.calculateStatistics()
    this.calculateBotStatistics()
    this.createDetailedBotAnalysis()
    this.createCharts()
    this.createBotCharts()
    this.createTables()
    this.createBotTable()
  }
}

// Initialize the analyzer when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new LogAnalyzer()
})
