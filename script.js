class LogAnalyzer {
  constructor() {
    this.logData = []
    this.filteredLogData = []
    this.charts = {}
    this.botPatterns = this.initializeBotPatterns()
    this.initializeEventListeners()

    // Statistics accumulators - process data without storing all entries
    this.stats = {
      totalEntries: 0,
      uniqueUrls: new Set(),
      statusCodes: {},
      totalBytes: 0,
      botRequests: 0,
      humanRequests: 0,
      uniqueBots: new Set(),
      botsByType: {},
      botStats: {},
      urlCounts: {},
      ipCounts: {},
      dailyData: {},
      minDate: null,
      maxDate: null,
    }
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
    const clearDataBtn = document.getElementById("clearData")
    const exportReportBtn = document.getElementById("exportReport")

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

    // Header button handlers
    clearDataBtn.addEventListener("click", () => {
      this.clearAllData()
    })

    exportReportBtn.addEventListener("click", () => {
      this.exportFullReport()
    })

    // Date range event listeners
    if (applyDateRangeBtn) {
      applyDateRangeBtn.addEventListener("click", () => {
        this.applyDateFilter()
      })
    }

    if (resetDateRangeBtn) {
      resetDateRangeBtn.addEventListener("click", () => {
        this.resetDateFilter()
      })
    }

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
    const fileSizeWarning = document.getElementById("fileSizeWarning")

    // Hide dropbox content and show file info
    dropboxContent.classList.add("hidden")
    fileInfo.classList.remove("hidden")

    // Update file details
    fileName.textContent = file.name
    fileSize.textContent = this.formatFileSize(file.size)

    // Show warning for large files
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > 25) {
      fileSizeWarning.classList.remove("hidden")
    } else {
      fileSizeWarning.classList.add("hidden")
    }

    // Enable analyze button
    analyzeBtn.disabled = false
  }

  clearFileSelection() {
    const fileInput = document.getElementById("logFile")
    const dropboxContent = document.querySelector(".dropbox-content")
    const fileInfo = document.getElementById("fileInfo")
    const analyzeBtn = document.getElementById("analyzeBtn")
    const fileSizeWarning = document.getElementById("fileSizeWarning")

    // Clear file input
    fileInput.value = ""

    // Show dropbox content and hide file info
    dropboxContent.classList.remove("hidden")
    fileInfo.classList.add("hidden")
    fileSizeWarning.classList.add("hidden")

    // Disable analyze button
    analyzeBtn.disabled = true
  }

  clearAllData() {
    // Clear all data and reset UI
    this.logData = []
    this.filteredLogData = []
    this.resetStats()
    this.destroyExistingCharts()

    // Hide results and clear file selection
    document.getElementById("results").classList.add("hidden")
    this.clearFileSelection()

    // Reset progress bar
    const progressBar = document.getElementById("progressBar")
    if (progressBar) {
      progressBar.style.width = "0%"
    }
  }

  resetStats() {
    this.stats = {
      totalEntries: 0,
      uniqueUrls: new Set(),
      statusCodes: {},
      totalBytes: 0,
      botRequests: 0,
      humanRequests: 0,
      uniqueBots: new Set(),
      botsByType: {},
      botStats: {},
      urlCounts: {},
      ipCounts: {},
      dailyData: {},
      minDate: null,
      maxDate: null,
    }
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

    // Check file size and warn user
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > 100) {
      const proceed = confirm(
        `This file is ${fileSizeMB.toFixed(1)}MB. Large files may take several minutes to process and could slow down your browser. Continue?`,
      )
      if (!proceed) return
    }

    this.showLoading(true)
    this.resetStats()

    try {
      // Use streaming line-by-line processing
      document.getElementById("loadingStatus").textContent = "Processing log entries..."
      this.updateProgress(0)

      await this.processFileLineByLine(file)

      document.getElementById("loadingStatus").textContent = "Generating analysis..."
      this.updateProgress(90)
      await new Promise((resolve) => setTimeout(resolve, 100))

      await this.displayResults()
      this.updateProgress(100)
    } catch (error) {
      console.error("Error analyzing log file:", error)
      alert(`Error analyzing log file: ${error.message}. Please check the file format or try a smaller file.`)
    } finally {
      this.showLoading(false)
    }
  }

  async processFileLineByLine(file) {
    const chunkSize = 64 * 1024 // 64KB chunks
    let offset = 0
    let buffer = ""
    let processedLines = 0

    const logRegex = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) ([^"]*) HTTP\/[\d.]+" (\d+) (\d+|-) "([^"]*)" "([^"]*)"/

    while (offset < file.size) {
      // Read chunk
      const chunk = file.slice(offset, offset + chunkSize)
      const text = await this.readChunk(chunk)
      buffer += text
      offset += chunkSize

      // Process complete lines
      const lines = buffer.split("\n")
      buffer = lines.pop() || "" // Keep incomplete line in buffer

      // Process each complete line
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line) {
          this.processLogLine(line, logRegex)
          processedLines++

          // Update progress every 1000 lines
          if (processedLines % 1000 === 0) {
            const progress = Math.min((offset / file.size) * 80, 80)
            this.updateProgress(progress)

            const statusElement = document.getElementById("loadingStatus")
            if (statusElement) {
              statusElement.textContent = `Processed ${processedLines.toLocaleString()} entries...`
            }

            // Yield control to prevent blocking
            await new Promise((resolve) => setTimeout(resolve, 1))
          }
        }
      }
    }

    // Process any remaining line in buffer
    if (buffer.trim()) {
      this.processLogLine(buffer.trim(), logRegex)
      processedLines++
    }

    this.updateProgress(80)
    console.log(`Processed ${processedLines} log entries`)
  }

  readChunk(chunk) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsText(chunk)
    })
  }

  processLogLine(line, logRegex) {
    const match = logRegex.exec(line)
    if (!match) return

    const [, ip, timestamp, method, url, status, size, referer, userAgent] = match

    // Parse timestamp
    let parsedDate
    try {
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
      parsedDate = new Date()
    }

    // Update statistics
    this.updateStats({
      ip,
      timestamp: parsedDate,
      method,
      url: url || "/",
      status: Number.parseInt(status),
      size: size === "-" ? 0 : Number.parseInt(size),
      referer,
      userAgent,
    })
  }

  updateStats(entry) {
    this.stats.totalEntries++
    this.stats.uniqueUrls.add(entry.url)

    const statusClass = Math.floor(entry.status / 100)
    this.stats.statusCodes[statusClass] = (this.stats.statusCodes[statusClass] || 0) + 1
    this.stats.totalBytes += entry.size

    // Update date range
    if (!this.stats.minDate || entry.timestamp < this.stats.minDate) {
      this.stats.minDate = entry.timestamp
    }
    if (!this.stats.maxDate || entry.timestamp > this.stats.maxDate) {
      this.stats.maxDate = entry.timestamp
    }

    // Daily data
    const dateKey = entry.timestamp.toISOString().split("T")[0]
    if (!this.stats.dailyData[dateKey]) {
      this.stats.dailyData[dateKey] = {
        total: 0,
        bots: 0,
        humans: 0,
        statusCodes: { 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    }
    this.stats.dailyData[dateKey].total++
    this.stats.dailyData[dateKey].statusCodes[statusClass] =
      (this.stats.dailyData[dateKey].statusCodes[statusClass] || 0) + 1

    // Bot detection
    const botInfo = this.detectBot(entry.userAgent)
    if (botInfo.isBot) {
      this.stats.botRequests++
      this.stats.uniqueBots.add(botInfo.name)
      this.stats.dailyData[dateKey].bots++

      if (!this.stats.botsByType[botInfo.type]) {
        this.stats.botsByType[botInfo.type] = 0
      }
      this.stats.botsByType[botInfo.type]++

      if (!this.stats.botStats[botInfo.name]) {
        this.stats.botStats[botInfo.name] = {
          name: botInfo.name,
          type: botInfo.type,
          company: botInfo.company,
          count: 0,
          lastSeen: entry.timestamp,
        }
      }
      this.stats.botStats[botInfo.name].count++
      if (entry.timestamp > this.stats.botStats[botInfo.name].lastSeen) {
        this.stats.botStats[botInfo.name].lastSeen = entry.timestamp
      }
    } else {
      this.stats.humanRequests++
      this.stats.dailyData[dateKey].humans++
    }

    // URL counts (keep only top 100 to save memory)
    this.stats.urlCounts[entry.url] = (this.stats.urlCounts[entry.url] || 0) + 1
    if (Object.keys(this.stats.urlCounts).length > 1000) {
      this.trimCounts(this.stats.urlCounts, 100)
    }

    // IP counts (keep only top 100 to save memory)
    this.stats.ipCounts[entry.ip] = (this.stats.ipCounts[entry.ip] || 0) + 1
    if (Object.keys(this.stats.ipCounts).length > 1000) {
      this.trimCounts(this.stats.ipCounts, 100)
    }
  }

  trimCounts(countsObj, keepTop) {
    const sorted = Object.entries(countsObj)
      .sort(([, a], [, b]) => b - a)
      .slice(0, keepTop)

    // Clear and rebuild with top entries only
    Object.keys(countsObj).forEach((key) => delete countsObj[key])
    sorted.forEach(([key, value]) => (countsObj[key] = value))
  }

  updateProgress(percentage) {
    const progressBar = document.getElementById("progressBar")
    if (progressBar) {
      progressBar.style.width = `${percentage}%`
    }
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

    // Check for generic bot indicators
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

  async displayResults() {
    // Destroy existing charts before creating new ones
    this.destroyExistingCharts()

    // Setup date range controls
    this.setupDateRange()

    // Display statistics
    this.displayStatistics()
    this.displayBotStatistics()
    this.displayBotAnalysis()

    // Create visualizations
    this.createCharts()
    this.createBotCharts()
    this.createTables()
    this.createBotTable()

    document.getElementById("results").classList.remove("hidden")
  }

  displayStatistics() {
    const daysDiff =
      this.stats.minDate && this.stats.maxDate
        ? Math.max(1, Math.ceil((this.stats.maxDate - this.stats.minDate) / (1000 * 60 * 60 * 24)))
        : 1

    // Update DOM
    document.getElementById("uniqueUrls").textContent = this.stats.uniqueUrls.size.toLocaleString()
    document.getElementById("uniqueUrlsPerDay").textContent = Math.round(this.stats.uniqueUrls.size / daysDiff)
    document.getElementById("totalEvents").textContent = this.stats.totalEntries.toLocaleString()
    document.getElementById("eventsPerDay").textContent = Math.round(
      this.stats.totalEntries / daysDiff,
    ).toLocaleString()
    document.getElementById("totalBytes").textContent = this.formatBytes(this.stats.totalBytes)
    document.getElementById("avgBytes").textContent = this.formatBytes(
      Math.round(this.stats.totalBytes / this.stats.totalEntries),
    )
    document.getElementById("bytesPerDay").textContent = this.formatBytes(Math.round(this.stats.totalBytes / daysDiff))
    document.getElementById("successCount").textContent = (this.stats.statusCodes[2] || 0).toLocaleString()
    document.getElementById("redirectionCount").textContent = (this.stats.statusCodes[3] || 0).toLocaleString()
    document.getElementById("clientErrorCount").textContent = (this.stats.statusCodes[4] || 0).toLocaleString()
    document.getElementById("serverErrorCount").textContent = (this.stats.statusCodes[5] || 0).toLocaleString()
    document.getElementById("errorCount").textContent = (
      (this.stats.statusCodes[4] || 0) + (this.stats.statusCodes[5] || 0)
    ).toLocaleString()
  }

  displayBotStatistics() {
    // Update DOM
    document.getElementById("totalBotRequests").textContent = this.stats.botRequests.toLocaleString()
    document.getElementById("botTrafficPercentage").textContent =
      this.stats.totalEntries > 0 ? ((this.stats.botRequests / this.stats.totalEntries) * 100).toFixed(1) + "%" : "0%"
    document.getElementById("uniqueBots").textContent = this.stats.uniqueBots.size.toLocaleString()
    document.getElementById("humanTrafficPercentage").textContent =
      this.stats.totalEntries > 0 ? ((this.stats.humanRequests / this.stats.totalEntries) * 100).toFixed(1) + "%" : "0%"
  }

  displayBotAnalysis() {
    // Update category counts
    document.getElementById("seoBotsCount").textContent =
      `${(this.stats.botsByType.seo || 0).toLocaleString()} requests`
    document.getElementById("aiBotsCount").textContent = `${(this.stats.botsByType.ai || 0).toLocaleString()} requests`
    document.getElementById("socialBotsCount").textContent =
      `${(this.stats.botsByType.social || 0).toLocaleString()} requests`
    document.getElementById("monitoringBotsCount").textContent =
      `${(this.stats.botsByType.monitoring || 0).toLocaleString()} requests`
    document.getElementById("securityBotsCount").textContent =
      `${(this.stats.botsByType.security || 0).toLocaleString()} requests`
    document.getElementById("otherBotsCount").textContent =
      `${(this.stats.botsByType.other || 0).toLocaleString()} requests`

    // Populate bot lists for each category
    this.populateBotList("seo", this.stats.botStats, this.stats.totalEntries)
    this.populateBotList("ai", this.stats.botStats, this.stats.totalEntries)
    this.populateBotList("social", this.stats.botStats, this.stats.totalEntries)
    this.populateBotList("monitoring", this.stats.botStats, this.stats.totalEntries)
    this.populateBotList("security", this.stats.botStats, this.stats.totalEntries)
    this.populateBotList("other", this.stats.botStats, this.stats.totalEntries)
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
    const dates = Object.keys(this.stats.dailyData).sort()

    const datasets = [
      {
        label: "Human Traffic",
        data: dates.map((date) => this.stats.dailyData[date].humans),
        borderColor: "#27ae60",
        backgroundColor: "rgba(39, 174, 96, 0.1)",
        tension: 0.4,
      },
      {
        label: "Bot Traffic",
        data: dates.map((date) => this.stats.dailyData[date].bots),
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

    const topBots = Object.entries(this.stats.botStats)
      .sort(([, a], [, b]) => b.count - a.count)
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
            data: topBots.map(([, bot]) => bot.count),
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
    const dates = Object.keys(this.stats.dailyData).sort()

    const datasets = [
      {
        label: "Success (2xx)",
        data: dates.map((date) => this.stats.dailyData[date].statusCodes[2] || 0),
        borderColor: "#27ae60",
        backgroundColor: "rgba(39, 174, 96, 0.1)",
        tension: 0.4,
      },
      {
        label: "Redirection (3xx)",
        data: dates.map((date) => this.stats.dailyData[date].statusCodes[3] || 0),
        borderColor: "#f39c12",
        backgroundColor: "rgba(243, 156, 18, 0.1)",
        tension: 0.4,
      },
      {
        label: "Client Error (4xx)",
        data: dates.map((date) => this.stats.dailyData[date].statusCodes[4] || 0),
        borderColor: "#e74c3c",
        backgroundColor: "rgba(231, 76, 60, 0.1)",
        tension: 0.4,
      },
      {
        label: "Server Error (5xx)",
        data: dates.map((date) => this.stats.dailyData[date].statusCodes[5] || 0),
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
    const dates = Object.keys(this.stats.dailyData).sort()

    this.charts.events = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates.map((date) => this.formatDate(new Date(date))),
        datasets: [
          {
            label: "Total Events",
            data: dates.map((date) => this.stats.dailyData[date].total),
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

    // Get top 10 URLs
    const topUrls = Object.entries(this.stats.urlCounts)
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
    const sortedBots = Object.values(this.stats.botStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 50)

    const tbody = document.querySelector("#botDetailsTable tbody")
    tbody.innerHTML = ""

    sortedBots.forEach((bot) => {
      const row = tbody.insertRow()
      const typeClass = `bot-type-${bot.type}`
      row.innerHTML = `
        <td><strong>${bot.name}</strong><br><small>${bot.company}</small></td>
        <td><span class="${typeClass}">${bot.type.toUpperCase()}</span></td>
        <td>${bot.count.toLocaleString()}</td>
        <td class="percentage">${((bot.count / this.stats.totalEntries) * 100).toFixed(2)}%</td>
        <td>${bot.lastSeen.toLocaleDateString()} ${bot.lastSeen.toLocaleTimeString()}</td>
      `
    })
  }

  createTopUrlsTable() {
    const topUrls = Object.entries(this.stats.urlCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)

    const tbody = document.querySelector("#topUrlsTable tbody")
    tbody.innerHTML = ""

    topUrls.forEach(([url, count]) => {
      const row = tbody.insertRow()
      row.innerHTML = `
        <td title="${url}">${url.length > 50 ? url.substring(0, 50) + "..." : url}</td>
        <td>${count.toLocaleString()}</td>
        <td class="percentage">${((count / this.stats.totalEntries) * 100).toFixed(2)}%</td>
      `
    })
  }

  createTopIpsTable() {
    const topIps = Object.entries(this.stats.ipCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)

    const tbody = document.querySelector("#topIpsTable tbody")
    tbody.innerHTML = ""

    topIps.forEach(([ip, count]) => {
      const row = tbody.insertRow()
      row.innerHTML = `
        <td>${ip}</td>
        <td>${count.toLocaleString()}</td>
        <td class="percentage">${((count / this.stats.totalEntries) * 100).toFixed(2)}%</td>
      `
    })
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
    if (!this.stats.minDate || !this.stats.maxDate) return

    const startDateInput = document.getElementById("startDate")
    const endDateInput = document.getElementById("endDate")

    // Set min and max values for date inputs
    startDateInput.min = this.formatDateForInput(this.stats.minDate)
    startDateInput.max = this.formatDateForInput(this.stats.maxDate)
    endDateInput.min = this.formatDateForInput(this.stats.minDate)
    endDateInput.max = this.formatDateForInput(this.stats.maxDate)

    // Set default values to full range
    startDateInput.value = this.formatDateForInput(this.stats.minDate)
    endDateInput.value = this.formatDateForInput(this.stats.maxDate)

    // Update info display
    document.getElementById("totalLogEntries").textContent = `${this.stats.totalEntries.toLocaleString()} total entries`
    document.getElementById("dateRangeSpan").textContent =
      `${this.stats.minDate.toLocaleDateString()} - ${this.stats.maxDate.toLocaleDateString()}`

    // Initialize filtered data with all data
    this.filteredLogData = []
  }

  formatDateForInput(date) {
    return date.toISOString().split("T")[0]
  }

  // Simplified date filtering - for now just show message
  applyDateFilter() {
    alert("Date filtering is temporarily disabled in streaming mode. This feature will be added in the next update.")
  }

  applyQuickFilter(days) {
    alert("Date filtering is temporarily disabled in streaming mode. This feature will be added in the next update.")
  }

  resetDateFilter() {
    alert("Date filtering is temporarily disabled in streaming mode. This feature will be added in the next update.")
  }

  exportFullReport() {
    const report = {
      summary: {
        totalRequests: this.stats.totalEntries,
        botTraffic: ((this.stats.botRequests / this.stats.totalEntries) * 100).toFixed(1) + "%",
        uniqueIPs: Object.keys(this.stats.ipCounts).length,
        errorRate:
          (
            (((this.stats.statusCodes[4] || 0) + (this.stats.statusCodes[5] || 0)) / this.stats.totalEntries) *
            100
          ).toFixed(1) + "%",
        dateRange: {
          start: this.stats.minDate ? this.stats.minDate.toISOString() : null,
          end: this.stats.maxDate ? this.stats.maxDate.toISOString() : null,
        },
      },
      botAnalysis: Object.values(this.stats.botStats).sort((a, b) => b.count - a.count),
      topUrls: Object.entries(this.stats.urlCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([url, count]) => ({ url, count })),
      topIPs: Object.entries(this.stats.ipCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([ip, count]) => ({ ip, count })),
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `access-log-analysis-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// Initialize the analyzer when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new LogAnalyzer()
})
