/**
 * AgroGrant Dashboard - Model-Agnostic AI Adapter Layer
 * 
 * Bu modül, kullanıcı arayüzünü doğrudan herhangi bir LLM sağlayıcısına (Google Gemini, OpenAI,
 * Ollama, OpenRouter, LiteLLM) bağlamak yerine, standart bir arayüz (Interface) üzerinden
 * tamamen soyutlar (Zero Vendor Lock-In).
 */

class BaseAIAdapter {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Çiftçi/Yatırımcı Danışmanı sohbet metodu
   * @param {Array<{role: string, content: string}>} messages 
   * @param {Object} grantContext - İncelenen hibenin detayları
   * @param {Object} options 
   * @returns {Promise<string>}
   */
  async chat(messages, grantContext, options = {}) {
    throw new Error("BaseAIAdapter.chat() uygulanmalıdır.");
  }

  /**
   * DSHD (Değerlendirme ve Süreç Haritası Departmanı) Rapor Üretimi
   * @param {Object} grant 
   * @returns {Promise<Object>}
   */
  async generateDSHDReport(grant) {
    throw new Error("BaseAIAdapter.generateDSHDReport() uygulanmalıdır.");
  }

  /**
   * Bürokratik şartname sadeleştirici
   * @param {string} rawDocumentText 
   * @returns {Promise<string>}
   */
  async simplifyBureaucracy(rawDocumentText) {
    throw new Error("BaseAIAdapter.simplifyBureaucracy() uygulanmalıdır.");
  }
}

/**
 * 1. MOCK AI ADAPTER
 * Sıfır maliyetli geliştirme, demo ve API anahtarı olmadan anında test için
 */
class MockAIAdapter extends BaseAIAdapter {
  async chat(messages, grantContext) {
    // Hafif asenkron gecikme (gerçekçi UI hissi)
    await new Promise(resolve => setTimeout(resolve, 600));

    const latestMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const grantTitle = grantContext?.title || "Seçilen Hibe";
    const agency = grantContext?.agency || "İlgili Kurum";

    if (latestMessage.includes("köy kahvesi") || latestMessage.includes("sade") || latestMessage.includes("anlat")) {
      return `🚜 **Köy Kahvesi Diliyle "${grantTitle}" Özeti:**\n\n` +
        `Hemşerim selamlar! Kısacası durum şu:\n` +
        `1. **Devlet ne veriyor?** Bu programda yapacağın harcamanın **%${grantContext?.rate || "65"}** kadarını devlet geri ödüyor. Cebinden önce para çıkıyor, faturaları sununca hibe hesabına yatıyor.\n` +
        `2. **Kime verirler?** ÇKS (Çiftçi Kayıt Sistemi) belgen en az 1-3 yıldır aktif olmalı, vergi borcun veya SGK borcun olmamalı.\n` +
        `3. **Tuzak nerede?** "Hemen parayı alırım" diye başlama! Önce projen onaylanacak, inşaatı/ekipmanı kendi paranla veya banka kredisiyle bitireceksin, mühendisler gelip denetledikten sonra hibe hesabına yatar.\n` +
        `4. **İlk yapman gereken:** İlçe Tarım'a gidip arazinin imar/kadastro uygunluğunu sorgulatmak!`;
    }

    if (latestMessage.includes("evrak") || latestMessage.includes("belge") || latestMessage.includes("şart")) {
      return `📋 **${agency} Başvurusu İçin Kritik Evrak Kontrol Listesi:**\n\n` +
        `• **ÇKS / TÜKAS Belgesi:** Güncel vizeli ve en az 1 yıllık.\n` +
        `• **Tapu veya Uzun Süreli Kira Sözleşmesi:** En az 5-10 yıllık noter onaylı kira şerhi.\n` +
        `• **Proforma Faturalar:** Alınacak makine/inşaat için piyasadan en az 3 adet kaşeli teklif.\n` +
        `• **Vergi / SGK Borcu Yoktur Yazısı:** Son 15 gün içinde alınmış e-Devlet barkodlu belge.\n` +
        `• **Geçici Teminat Mektubu:** Hibe tutarının %3 ila %5'i oranında banka teminatı.`;
    }

    if (latestMessage.includes("taslak") || latestMessage.includes("proje") || latestMessage.includes("öneri")) {
      return `💡 **${grantTitle} İçin Yüksek Puan Alacak Proje Taslağı:**\n\n` +
        `**Proje Adı:** Öz Tüketim Güneş Enerjili & Modern Otomasyonlu Tesis Dönüşümü\n` +
        `**Hedef Puan:** 85+ (Öncelik Kriteri: Genç Çiftçi / Kadın Girişimci + Yenilenebilir Enerji Entegrasyonu)\n` +
        `**Önerilen Yatırım Kalemleri:**\n` +
        `1. Çatı tipi GES (Güneş Enerji Santrali) ile elektrik giderini sıfırlama.\n` +
        `2. Otomatik sulama / iklimlendirme otomasyonu.\n` +
        `3. Biyogüvenlik ve atık yönetim ünitesi.\n` +
        `*Not: Danışmanlık ve mimari proje masrafları da %100'e varan oranlarda genel gider kaleminden karşılanabilir!*`;
    }

    return `Selamlar! Ben **AgroGrant AI Hibe Danışmanı**.\n\n` +
      `Şu an **"${grantTitle}"** çağrısını inceliyorsunuz. Bu hibe çağrısı hakkında merak ettiğiniz:\n` +
      `• Kimlerin başvurabileceğini,\n` +
      `• Puanlama kriterlerini ve gizli bürokratik tuzakları,\n` +
      `• Başvuru dosyasında hangi evrakların şart olduğunu sorabilirsiniz. Size nasıl yardımcı olabilirim?`;
  }

  async generateDSHDReport(grant) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simüle edilmiş uzman denetim raporu
    return {
      grantId: grant.id,
      title: grant.title,
      agency: grant.agency,
      generatedAt: new Date().toLocaleDateString("tr-TR"),
      bureaucracyScore: grant.bureaucracyScore || 7.8,
      riskLevel: grant.riskLevel || "Orta Risk",
      legalWatchpoints: [
        "Ayni Katkı Şartı: Yatırımın KDV tutarı hibe kapsamı dışındadır. Çiftçi KDV'yi peşin finanse edebilmelidir.",
        "5 Yıl Devredilemezlik Şerhi: Alınan ekipman veya yapılan tesis 5 yıl boyunca satılamaz, devredilemez veya amacı dışında kullanılamaz (yılda bir kez habersiz teftiş yapılır).",
        "Geçici Kabul ve Hakediş Prosedürü: İnşaat işlerinde yapı kullanım izin belgesi (iskan) alınmadan kesin hak ediş ödenmez.",
        "Banka Teminat Mektubu: Avans hibe ödemesi talep edilirse %110 oranında teminat mektubu talep edilmektedir."
      ],
      unionWarnings: [
        "Ziraat Mühendisleri Odası Uyarısı: Şartnamedeki makine-ekipman rayiç tavan bedelleri 6 ay öncesinin kuruna göredir; bayi satış fiyatlarıyla hibe tavanı arasında %15-20 fark oluşabilir.",
        "Damızlık Sığır Yetiştiricileri Birliği: Gebe düve alımlarında ari işletme sertifikası aranmakta, bu sertifikaya sahip hayvanların piyasa temini zaman almaktadır."
      ],
      timeline: [
        { phase: "1. Aşama", name: "Evrak ve Proje Hazırlığı", duration: "3-4 Hafta", status: "Kritik" },
        { phase: "2. Aşama", name: "Online Sistem Başvurusu", duration: "1 Hafta", status: "Sistem Kapanışına Dikkat" },
        { phase: "3. Aşama", name: "İl Koordinatörlüğü İncelemesi", duration: "6-8 Hafta", status: "Eksik Evrak Tamamlama" },
        { phase: "4. Aşama", name: "Sözleşme İmza & Yatırım Başlangıcı", duration: "2 Hafta", status: "Banka Teminatı" },
        { phase: "5. Aşama", name: "Yatırım Denetimi & Hibe Ödemesi", duration: "4-6 Hafta", status: "Ödeme Aşaması" }
      ],
      verifiedLinks: [
        { label: "Resmî Gazete İlanı & Tebliğ", url: "https://www.resmigazete.gov.tr" },
        { label: "Kurum Başvuru Kılavuzu (PDF)", url: grant.link || "https://www.tarimorman.gov.tr" },
        { label: "Online Başvuru Portalı", url: "https://hibedestek.tarimorman.gov.tr" }
      ]
    };
  }

  async simplifyBureaucracy(rawText) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return `📌 **Sadeleştirilmiş Şart:**\n${rawText.slice(0, 200)}...\n\n👉 **Pratik Anlamı:** Belirtilen evrakları zamanında teslim etmezseniz dosyanız doğrudan elenir, itiraz hakkı 7 iş günüdür.`;
  }
}

/**
 * 2. GOOGLE GEMINI ADAPTER
 * Gemini 2.5 Pro / Flash modelleri ile doğrudan REST bağlantısı
 */
class GeminiAdapter extends BaseAIAdapter {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.apiKey || "";
    this.model = config.model || "gemini-2.5-flash"; // veya gemini-2.5-pro
    this.endpoint = "https://generativelanguage.googleapis.com/v1beta/models";
  }

  async chat(messages, grantContext) {
    if (!this.apiKey) {
      throw new Error("Gemini API Anahtarı eksik! Lütfen ayarlardan API anahtarınızı girin.");
    }

    const systemPrompt = `Sen Türkiye ve uluslararası tarım, hayvancılık, hibe ve destek programları konusunda uzman bir 'AgroGrant Hibe Danışmanı'sın.
Kullanıcının sorduğu soruları Türk çiftçisinin ve tarım yatırımcısının anlayacağı şekilde, gereksiz bürokratik dilden uzak, net, samimi ve operasyonel adımlarla yanıtla.
Mevcut İncelenen Hibe: ${JSON.stringify(grantContext || {})}`;

    const formattedContents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await fetch(`${this.endpoint}/${this.model}:generateContent?key=${this.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: formattedContents,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Gemini API Hatası: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı.";
  }

  async generateDSHDReport(grant) {
    if (!this.apiKey) {
      // API anahtarı yoksa otomatik Mock adapter'a fallback yap
      console.warn("Gemini API anahtarı bulunamadı, Mock AI sonuçları getiriliyor.");
      return new MockAIAdapter().generateDSHDReport(grant);
    }

    const prompt = `Aşağıdaki tarım hibe çağrısı için 'Değerlendirme ve Süreç Haritası Departmanı (DSHD)' formatında JSON analiz üret:
Hibe Bilgileri: ${JSON.stringify(grant)}

JSON formatı:
{
  "bureaucracyScore": 8.2,
  "riskLevel": "Orta" veya "Yüksek" veya "Düşük",
  "legalWatchpoints": ["madde 1", "madde 2", "madde 3"],
  "unionWarnings": ["ziraat odası uyarısı 1", "piyasa uyarısı 2"],
  "timeline": [{"phase": "1. Aşama", "name": "Ad", "duration": "Süre", "status": "Durum"}]
}`;

    const response = await fetch(`${this.endpoint}/${this.model}:generateContent?key=${this.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) {
      return new MockAIAdapter().generateDSHDReport(grant);
    }

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    try {
      const parsed = JSON.parse(rawJson);
      return {
        ...parsed,
        grantId: grant.id,
        title: grant.title,
        agency: grant.agency,
        generatedAt: new Date().toLocaleDateString("tr-TR"),
        verifiedLinks: [
          { label: "Resmî Gazete İlanı & Tebliğ", url: "https://www.resmigazete.gov.tr" },
          { label: "Kurum Başvuru Kılavuzu (PDF)", url: grant.link || "#" }
        ]
      };
    } catch {
      return new MockAIAdapter().generateDSHDReport(grant);
    }
  }
}

/**
 * 3. OPENAI / LITELLM / OPENROUTER ADAPTER
 * Standart OpenAI uyumlu REST uç noktaları (/v1/chat/completions)
 */
class OpenAICompatibleAdapter extends BaseAIAdapter {
  constructor(config = {}) {
    super(config);
    this.apiKey = config.apiKey || "";
    this.baseUrl = config.baseUrl || "https://openrouter.ai/api/v1";
    this.model = config.model || "deepseek/deepseek-r1:free";
  }

  async chat(messages, grantContext) {
    if (!this.apiKey && !this.baseUrl.includes("localhost")) {
      throw new Error("API Anahtarı eksik! Lütfen ayarlardan API anahtarınızı girin.");
    }

    const systemMessage = {
      role: "system",
      content: `Sen bir tarım ve hayvancılık hibe danışmanısın. Çiftçilere en sade ve net dille rehberlik et. Aktif hibe: ${JSON.stringify(grantContext || {})}`
    };

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [systemMessage, ...messages],
        temperature: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`API Hatası: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Cevap üretilemedi.";
  }

  async generateDSHDReport(grant) {
    // LiteLLM / OpenRouter üzerinden çalıştır veya Mock'a devret
    return new MockAIAdapter().generateDSHDReport(grant);
  }
}

/**
 * 4. OLLAMA ADAPTER (Sıfır Maliyetli Yerel Modeller)
 * Bilgisayarınızda çalışan Ollama (DeepSeek-R1, Llama3, Mistral) ile entegrasyon
 */
class OllamaAdapter extends BaseAIAdapter {
  constructor(config = {}) {
    super(config);
    this.baseUrl = config.baseUrl || "http://localhost:11434";
    this.model = config.model || "deepseek-r1:8b";
  }

  async chat(messages, grantContext) {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: "system",
              content: `Tarım ve hayvancılık hibe danışmanısın. Aktif hibe: ${grantContext?.title || "Belirtilmedi"}`
            },
            ...messages
          ],
          stream: false
        })
      });

      if (!response.ok) throw new Error("Ollama bağlantısı başarısız.");
      const data = await response.json();
      return data.message?.content || "Ollama'dan yanıt alınamadı.";
    } catch (e) {
      throw new Error(`Ollama çalışmıyor olabilir (${this.baseUrl}): ${e.message}`);
    }
  }

  async generateDSHDReport(grant) {
    return new MockAIAdapter().generateDSHDReport(grant);
  }
}

/**
 * AI ORCHESTRATOR / FACTORY
 * UI tarafında seçilen sağlayıcıyı tek merkezden yönetir.
 */
class AIManager {
  constructor() {
    this.currentProvider = localStorage.getItem("agro_ai_provider") || "mock";
    this.apiKey = localStorage.getItem("agro_ai_key") || "";
    this.model = localStorage.getItem("agro_ai_model") || "";
    this.baseUrl = localStorage.getItem("agro_ai_baseurl") || "";
    this.adapter = this._createAdapter();
  }

  _createAdapter() {
    const config = {
      apiKey: this.apiKey,
      model: this.model,
      baseUrl: this.baseUrl
    };

    switch (this.currentProvider) {
      case "gemini":
        return new GeminiAdapter(config);
      case "openai":
      case "openrouter":
        return new OpenAICompatibleAdapter(config);
      case "ollama":
        return new OllamaAdapter(config);
      case "mock":
      default:
        return new MockAIAdapter(config);
    }
  }

  setProvider(provider, options = {}) {
    this.currentProvider = provider;
    if (options.apiKey !== undefined) this.apiKey = options.apiKey;
    if (options.model !== undefined) this.model = options.model;
    if (options.baseUrl !== undefined) this.baseUrl = options.baseUrl;

    localStorage.setItem("agro_ai_provider", this.currentProvider);
    localStorage.setItem("agro_ai_key", this.apiKey);
    localStorage.setItem("agro_ai_model", this.model);
    localStorage.setItem("agro_ai_baseurl", this.baseUrl);

    this.adapter = this._createAdapter();
    console.log(`[AIManager] Aktif sağlayıcı güncellendi: ${provider}`);
  }

  getAdapter() {
    return this.adapter;
  }

  getConfig() {
    return {
      provider: this.currentProvider,
      apiKey: this.apiKey,
      model: this.model,
      baseUrl: this.baseUrl
    };
  }
}

// Global Singleton Instance
window.agroAI = new AIManager();
