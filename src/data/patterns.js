export const patterns = [
  {
    id: "singleton",
    name: "Singleton",
    category: "Creational",
    description: "Bir sınıfın (class) yalnızca bir örneğinin (instance) olduğundan emin olmayı ve bu örneğe global bir erişim noktası sağlamayı amaçlayan yaratıcılık (creational) kalıbıdır.",
    problem: "Bazen bir nesnenin proje genelinde sadece bir tane olması gerekir. Örneğin; veritabanı bağlantı yöneticisi (Database Connection Manager) veya uygulama ayarları. Aynı bağlantıyı tekrar tekrar oluşturmak sistem kaynaklarını tüketir ve tutarsızlıklara yol açar.",
    whenToUse: "Sistemde paylaşılan tek bir kaynağa ihtiyaç duyduğunuzda, örneğin konfigürasyon yönetimi, loglama veya önbellek (cache) sistemlerinde kullanılır.",
    whenNotToUse: "Global state (durum) kullanımının test edilebilirliği zorlaştırdığı durumlarda veya bağımlılık enjeksiyonu (Dependency Injection) ile çözülebilecek basit senaryolarda kaçınılmalıdır.",
    realWorld: "Bir ofisteki tek bir yazıcı (Printer). Tüm çalışanlar aynı yazıcıya iş gönderir, her çalışan için yeni bir yazıcı satın alınmaz.",
    code: `public sealed class DatabaseConnectionManager
{
    // Lazy C#'ta thread-safe Singleton uygulamak için en modern ve güvenli yoldur.
    private static readonly Lazy<DatabaseConnectionManager> _instance = new
     Lazy<DatabaseConnectionManager>(() => new DatabaseConnectionManager());

    // Dışarıdan nesne oluşturulmasını engellemek için private constructor
    private DatabaseConnectionManager()
    {
        Console.WriteLine("Veritabanı bağlantısı kuruldu.");
    }

    // Global erişim noktası
    public static DatabaseConnectionManager Instance => _instance.Value;

    public void ExecuteQuery(string query)
    {
        Console.WriteLine($"Sorgu çalıştırılıyor: {query}");
    }
}`,
    explanation: [
      "sealed anahtar kelimesi: Sınıfın miras alınmasını (inheritance) engeller. Bu, singleton yapısının kırılmasını önler.",
      "Lazy: C#'ta nesnenin sadece gerçekten ihtiyaç duyulduğunda (ilk çağrıldığında) oluşturulmasını sağlar ve aynı zamanda otomatik olarak thread-safe (iş parçacığı güvenli) bir yapı sunar.",
      "private constructor: Dışarıdan 'new DatabaseConnectionManager()' yazılmasını engeller.",
      "Instance propertysi: Sınıfın tek örneğine ulaşmak için kullandığımız global kapıdır."
    ],
    pros: ["Sınıfın sadece bir örneği olduğundan emin olursunuz.", "Bu örneğe her yerden ulaşabilirsiniz.", "Nesne sadece ihtiyaç duyulduğunda yaratılır (Lazy Initialization)."],
    cons: ["Single Responsibility (Tek Sorumluluk) prensibini ihlal edebilir.", "Unit test yazmayı zorlaştırabilir çünkü global bir durumu (state) temsil eder."],
    related: ["Facade", "Builder", "Prototype"],
    uml: "[ İstemci ] -----> [ Singleton Class | - instance | + GetInstance() ]",
    summary: "Singleton, sistem genelinde sadece bir kopyası olması gereken kritik bileşenler için hayat kurtarıcıdır, ancak bir anti-pattern'e dönüşmemesi için sadece gerçekten ihtiyaç duyulduğunda kullanılmalıdır."
  },
  {
    id: "factory-method",
    name: "Factory Method",
    category: "Creational",
    description: "Nesne oluşturma işlemini bir arayüze (interface) veya soyut (abstract) sınıfa devrederek, alt sınıfların hangi nesneyi üreteceğine karar vermesini sağlayan kalıptır.",
    problem: "Sisteminize yeni bir ürün (örneğin yeni bir bildirim türü) eklemek istediğinizde, mevcut kodu sürekli 'if-else' veya 'switch' bloklarıyla değiştirmek zorunda kalıyorsanız kodunuz karmaşıklaşır ve Open/Closed prensibine aykırı hareket etmiş olursunuz.",
    whenToUse: "Kodunuzun, oluşturması gereken nesnelerin kesin türlerini ve bağımlılıklarını önceden bilemediği durumlarda kullanılır.",
    whenNotToUse: "Sadece tek veya çok az sayıda sabit nesne üretecekseniz mimariyi gereksiz yere karmaşıklaştırır.",
    realWorld: "Bir lojistik firması. Karayolu taşımacılığı için Kamyon, denizyolu için Gemi oluşturur. Lojistik merkezi (Factory) sadece 'Bana taşıma aracı ver' der, duruma göre doğru araç üretilir.",
    code: `// 1. Ortak Arayüz (Interface)
public interface ILogger
{
    void Log(string message);
}

// 2. Somut Ürünler (Concrete Products)
public class FileLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"Dosyaya yazıldı: {message}");
}

public class DatabaseLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"Veritabanına eklendi: {message}");
}

// 3. Yaratıcı Sınıf (Creator)
public abstract class LoggerFactory
{
    // Factory Method
    public abstract ILogger CreateLogger();

    public void DoLog(string message)
    {
        ILogger logger = CreateLogger();
        logger.Log(message);
    }
}

// 4. Somut Yaratıcılar (Concrete Creators)
public class FileLoggerFactory : LoggerFactory
{
    public override ILogger CreateLogger() => new FileLogger();
}

public class DatabaseLoggerFactory : LoggerFactory
{
    public override ILogger CreateLogger() => new DatabaseLogger();
}`,
    explanation: [
      "ILogger: Üretilecek tüm nesnelerin ortak özelliklerini belirleyen arayüz.",
      "FileLogger / DatabaseLogger: Gerçek işi yapan somut sınıflar.",
      "LoggerFactory: İçerisinde CreateLogger() adında soyut bir metod (Factory Method) barındırır.",
      "FileLoggerFactory / DatabaseLoggerFactory: LoggerFactory'den kalıtım alarak CreateLogger() metodunu ezer (override) ve kendi ilgili nesnelerini dönerler."
    ],
    pros: ["Nesne oluşturma mantığı ile nesneyi kullanan iş mantığını ayırır.", "Single Responsibility ve Open/Closed prensiplerini destekler.", "Yeni bir tür eklemek için mevcut kodu bozmadan yeni bir Factory sınıfı eklemek yeterlidir."],
    cons: ["Her yeni ürün için yeni bir ürün sınıfı ve yeni bir creator (yaratıcı) sınıfı eklemek gerektiğinden dosya ve sınıf sayısı hızla artabilir."],
    related: ["Abstract Factory", "Builder", "Prototype"],
    uml: "[ Creator ] <|-- [ ConcreteCreator ] ---> [ ConcreteProduct ] --|> [ Product Interface ]",
    summary: "Nesne oluşturma sürecini alt sınıflara bırakarak kodun genişletilebilirliğini artıran, sıkça kullanılan bir temel kalıptır."
  },
  {
    id: "builder",
    name: "Builder",
    category: "Creational",
    description: "Karmaşık nesnelerin adım adım oluşturulmasını sağlayan yaratıcılık kalıbıdır. Aynı oluşturma süreci farklı temsiller (farklı özelliklere sahip nesneler) üretebilir.",
    problem: "Çok fazla parametre alan bir kurucu metodunuz (constructor) varsa (örneğin 10 parametre) ve bunların çoğu opsiyonelse, kodu okumak ve nesneyi oluşturmak bir kabusa dönüşür (Telescoping Constructor Anti-Pattern).",
    whenToUse: "Farklı özelliklerin birleşimiyle oluşabilecek kompleks nesneler yaratmanız gerektiğinde (örn: HTTP Request oluşturucu, SQL Sorgu oluşturucu).",
    whenNotToUse: "Nesneniz sadece 2-3 basit özelliğe sahipse gereksiz mühendislik (over-engineering) olur.",
    realWorld: "Bir hamburger menüsü sipariş etmek. Önce ekmek seçilir, sonra et, ardından peynir ve soslar eklenir. İstemediğiniz adımı atlarsınız.",
    code: `public class HttpRequest
{
    public string Url { get; set; }
    public string Method { get; set; }
    public string Body { get; set; }
    public Dictionary<string, string> Headers { get; set; } = new();

    public override string ToString() => $"[{Method}] {Url} - Body: {Body}";
}

// Fluent Builder
public class HttpRequestBuilder
{
    private HttpRequest _request = new HttpRequest();

    public HttpRequestBuilder SetUrl(string url)
    {
        _request.Url = url;
        return this; // this dönerek metotların zincirlenmesini (fluent) sağlarız
    }

    public HttpRequestBuilder SetMethod(string method)
    {
        _request.Method = method;
        return this;
    }

    public HttpRequestBuilder AddHeader(string key, string value)
    {
        _request.Headers.Add(key, value);
        return this;
    }

    public HttpRequestBuilder SetBody(string body)
    {
        _request.Body = body;
        return this;
    }

    public HttpRequest Build()
    {
        // Gerekli validasyonlar (doğrulamalar) burada yapılabilir
        if (string.IsNullOrEmpty(_request.Url))
            throw new Exception("URL boş olamaz!");
            
        return _request;
    }
}

// Kullanımı:
// var request = new HttpRequestBuilder()
//      .SetUrl("https://api.example.com")
//      .SetMethod("POST")
//      .SetBody("{'id':1}")
//      .Build();`,
    explanation: [
      "HttpRequest: Üretmek istediğimiz karmaşık nesne.",
      "HttpRequestBuilder: Nesneyi adım adım inşa eden sınıf.",
      "Return this: Metotların geriye sınıfın kendisini (this) dönmesi, 'Fluent Interface' dediğimiz zincirleme kullanım yapısını sağlar (obj.SetX().SetY()).",
      "Build(): İnşa sürecini tamamlar, gerekirse doğrulama yapar ve nihai nesneyi teslim eder."
    ],
    pros: ["Karmaşık yapıdaki nesnelerin oluşturulma kodunu okunabilir kılar.", "Oluşturulma aşamasında nesnenin hatalı/eksik bir durumda kullanılmasını engeller.", "Nesne oluşturma adımlarını kontrol altında tutar."],
    cons: ["Sadece builder tasarımı için ekstra sınıflar oluşturulması gerekir, bu da kod tabanını büyütür."],
    related: ["Factory Method", "Singleton", "Composite"],
    uml: "[ Builder ] ---> [ Product ]",
    summary: "Eğer bir nesnenin constructor'ı (yapıcı metodu) çok fazla parametre almaya başladıysa ve bu nesneyi esnek bir şekilde kurmak istiyorsanız Builder en iyi dostunuzdur."
  },
  {
    id: "adapter",
    name: "Adapter",
    category: "Structural",
    description: "Birbiriyle uyumsuz arayüzlere (interface) sahip nesnelerin birlikte çalışabilmesini sağlayan yapısal (structural) bir tasarım kalıbıdır.",
    problem: "Dışarıdan bir kütüphane (Örn: eski bir XML ödeme sistemi) kullanmak istiyorsunuz ancak sizin modern sisteminiz JSON arayüzü ile çalışıyor. Sisteminizin kodunu veya dış kütüphaneyi değiştiremezsiniz.",
    whenToUse: "Mevcut bir sınıfı kullanmak istediğinizde, ancak arayüzü kodunuzun geri kalanıyla eşleşmediğinde kullanılır.",
    whenNotToUse: "Sınıfların kaynak kodlarına erişiminiz varsa ve bunları değiştirmek daha kolaysa Adapter'a gerek yoktur.",
    realWorld: "Türkiye'den aldığınız fişi İngiltere'deki prizde kullanmak için araya taktığınız priz dönüştürücü adaptör.",
    code: `// 1. Bizim Sistemimizin Beklediği Modern Arayüz
public interface IModernPaymentProcessor
{
    void ProcessPaymentInJson(string jsonPayload);
}

// 2. Dışarıdan Gelen/Eski Sistem (Adaptee - Uyarlanan)
public class LegacyXmlPaymentSystem
{
    public void Pay(string xmlData)
    {
        Console.WriteLine($"Eski sistem XML ile ödeme aldı: {xmlData}");
    }
}

// 3. Adapter Sınıfı
public class PaymentAdapter : IModernPaymentProcessor
{
    private readonly LegacyXmlPaymentSystem _legacySystem;

    // Bağımlılığı enjekte ediyoruz
    public PaymentAdapter(LegacyXmlPaymentSystem legacySystem)
    {
        _legacySystem = legacySystem;
    }

    // Bizim modern metodumuz çağrıldığında, arka planda dönüşüm yapıp eski sistemi çağırır
    public void ProcessPaymentInJson(string jsonPayload)
    {
        // Gerçek hayatta burada JSON'u XML'e dönüştüren bir mantık olur
        string xmlPayload = $"{jsonPayload}"; 
        
        Console.WriteLine("Adapter: JSON veri XML'e dönüştürüldü.");
        _legacySystem.Pay(xmlPayload);
    }
}`,
    explanation: [
      "IModernPaymentProcessor: Sistemimizin anladığı ve çalıştığı güncel arayüz.",
      "LegacyXmlPaymentSystem: Kaynak kodunu değiştiremediğimiz, dışarıdan gelen veya eski yapı.",
      "PaymentAdapter: Modern arayüzü implemente eder, içine eski sistemi alır (Composition).",
      "ProcessPaymentInJson: Metod çağrıldığında parametreyi (JSON) eski sistemin anlayacağı formata (XML) çevirir ve eski sistemin Pay metodunu tetikler."
    ],
    pros: ["Uyumsuz arayüzleri, mevcut kodu bozmadan birbiriyle çalıştırır.", "Single Responsibility ve Open/Closed prensiplerine uyar."],
    cons: ["Sisteme yeni arayüzler ve sınıflar eklendiği için karmaşıklık artar."],
    related: ["Bridge", "Decorator", "Facade"],
    uml: "[ Client ] ---> [ Target Interface ] <|-- [ Adapter ] ---> [ Adaptee ]",
    summary: "Adapter, iki farklı dünyayı (arayüzü) birbiriyle konuşturan çevirmen görevi görür."
  },
  {
    id: "decorator",
    name: "Decorator",
    category: "Structural",
    description: "Nesnelere, kodlarını değiştirmeden dinamik olarak yeni davranışlar veya sorumluluklar eklemenizi sağlayan tasarım kalıbıdır.",
    problem: "Bir sınıfın davranışını değiştirmek için sürekli alt sınıflar (subclass) oluşturursanız, bir süre sonra kombinasyon patlaması yaşarsınız (Örn: VeriServisi, LogluVeriServisi, CacheliVeriServisi, LogluVeCacheliVeriServisi...).",
    whenToUse: "Bir nesneye çalışma zamanında (runtime) esnek bir şekilde ek özellikler kazandırmak istediğinizde kullanılır.",
    whenNotToUse: "Sıralama önemliyse veya dekoratörlerin birbirini tanıması gerekiyorsa tasarım karmaşıklaşır.",
    realWorld: "Bir kahve dükkanı. Sade kahvenin üzerine süt (Süt Dekoratörü), sonra karamel (Karamel Dekoratörü) eklersiniz. Temelde obje hala kahvedir ama fiyatı ve özellikleri dinamik olarak artmıştır.",
    code: `// 1. Temel Bileşen Arayüzü
public interface IDataService
{
    string GetData();
}

// 2. Somut Bileşen (Asıl işi yapan sınıf)
public class DatabaseService : IDataService
{
    public string GetData()
    {
        return "Veritabanından çekilen asıl veri";
    }
}

// 3. Temel Decorator Sınıfı
public abstract class DataServiceDecorator : IDataService
{
    protected readonly IDataService _wrapper; // İçinde sardığı obje

    public DataServiceDecorator(IDataService wrapper)
    {
        _wrapper = wrapper;
    }

    public virtual string GetData()
    {
        return _wrapper.GetData();
    }
}

// 4. Somut Decorator: Loglama özelliği ekler
public class LoggingDecorator : DataServiceDecorator
{
    public LoggingDecorator(IDataService wrapper) : base(wrapper) { }

    public override string GetData()
    {
        Console.WriteLine("Log: GetData metodu çağrıldı.");
        return base.GetData(); // Asıl işlemi çağır
    }
}

// 5. Somut Decorator: Veriyi şifreleme özelliği ekler
public class EncryptionDecorator : DataServiceDecorator
{
    public EncryptionDecorator(IDataService wrapper) : base(wrapper) { }

    public override string GetData()
    {
        string rawData = base.GetData();
        return $"[ŞİFRELENDİ] {rawData}";
    }
}`,
    explanation: [
      "IDataService: Hem asıl sınıfın hem de dekoratörlerin uygulayacağı ortak arayüz.",
      "DatabaseService: Davranış eklenecek temel sınıf.",
      "DataServiceDecorator: Kendisi de bir IDataService'dir ancak içinde başka bir IDataService taşır (_wrapper).",
      "LoggingDecorator & EncryptionDecorator: Ekstra işlemleri yapar (loglama, şifreleme) ve asıl işi _wrapper objesine yaptırır."
    ],
    pros: ["Kalıtım (inheritance) yerine kompozisyon (composition) kullanarak alt sınıf patlamasını önler.", "Nesneye çalışma zamanında dinamik özellik eklenip çıkarılabilir."],
    cons: ["Çok fazla küçük dekoratör sınıfı oluşur.", "Dekoratörlerin sarılma sırası bazen beklenmedik sonuçlara yol açabilir."],
    related: ["Adapter", "Composite", "Proxy"],
    uml: "[ Component Interface ] <|-- [ ConcreteComponent ]  &  [ Component Interface ] <|-- [ Decorator (has Component) ]",
    summary: "Sınıfınızı miras alarak statik şekilde genişletmek yerine, bir Rus matruşkası gibi nesneleri iç içe sararak dinamik olarak güçlendirmenizi sağlar."
  },
  {
    id: "strategy",
    name: "Strategy",
    category: "Behavioral",
    description: "Bir algoritma ailesi tanımlamanızı, her birini kendi sınıfı içine koymanızı ve nesnelerinin birbiriyle yer değiştirebilir olmasını sağlayan davranışsal kalıptır.",
    problem: "Bir sınıf içinde, belirli bir işlemi yapmak için (Örneğin e-ticarette kargo ücreti hesaplama) devasa if-else veya switch-case blokları kullanmak kodu okunmaz hale getirir.",
    whenToUse: "Bir nesnenin içinde aynı işi yapan ancak farklı algoritmalar/yöntemler barındıran durumlar varsa.",
    whenNotToUse: "Algoritmalarınız çok nadir değişiyorsa veya sadece bir iki tane ise, gereksiz karmaşıklık yaratır.",
    realWorld: "Havalimanına gitmek. Taksiyi (Taksi Stratejisi), Otobüsü (Otobüs Stratejisi) veya Kendi Aracınızı (Araç Stratejisi) seçebilirsiniz. Hedef aynıdır ama gidiş algoritması değişir.",
    code: `// 1. Strateji Arayüzü
public interface IShippingStrategy
{
    double CalculateCost(double orderTotal);
}

// 2. Somut Stratejiler
public class StandardShipping : IShippingStrategy
{
    public double CalculateCost(double orderTotal) => 20.0;
}

public class ExpressShipping : IShippingStrategy
{
    public double CalculateCost(double orderTotal) => 50.0;
}

public class FreeShipping : IShippingStrategy
{
    public double CalculateCost(double orderTotal) => orderTotal >= 200 ? 0 : 20.0;
}

// 3. Bağlam (Context) Sınıfı
public class Order
{
    private IShippingStrategy _shippingStrategy;
    private double _orderTotal;

    public Order(double orderTotal)
    {
        _orderTotal = orderTotal;
    }

    // Strateji çalışma zamanında dinamik olarak değiştirilebilir
    public void SetShippingStrategy(IShippingStrategy strategy)
    {
        _shippingStrategy = strategy;
    }

    public void Checkout()
    {
        if (_shippingStrategy == null)
            throw new Exception("Kargo stratejisi seçilmedi!");

        double cost = _shippingStrategy.CalculateCost(_orderTotal);
        Console.WriteLine($"Toplam Sipariş: {_orderTotal} TL, Kargo Ücreti: {cost} TL");
    }
}`,
    explanation: [
      "IShippingStrategy: Tüm kargo hesaplama algoritmalarının uyması gereken sözleşme.",
      "StandardShipping vs FreeShipping: Kendi içlerinde farklı hesaplama algoritmaları barındıran strateji sınıfları.",
      "Order (Context): İşlemi asıl yürüten sınıftır. Kargo hesaplama işini kendisi yapmak (if-else) yerine, içine enjekte edilen strateji nesnesine (Delegate) devreder.",
      "SetShippingStrategy: Algoritmanın çalışma anında (runtime) değiştirilmesine olanak tanır."
    ],
    pros: ["Algoritmaları kullanan sınıftan (Order) soyutlayarak, if-else cehenneminden kurtarır.", "Open/Closed prensibi: Yeni strateji eklemek mevcut kodları bozmaz.", "Çalışma zamanında davranışı değiştirmeye olanak tanır."],
    cons: ["Sistemdeki sınıf sayısını artırır.", "İstemci (Client) uygun stratejiyi seçmek için stratejiler arasındaki farkı bilmek zorundadır."],
    related: ["State", "Command", "Template Method"],
    uml: "[ Context (has Strategy) ] ---> [ Strategy Interface ] <|-- [ ConcreteStrategyA, B, C ]",
    summary: "İş mantığınızda çok fazla if-else koşulu varsa ve algoritmalar birbirinin alternatifi ise, Strategy kalıbı kodu parçalara ayırarak tertemiz bir yapı kurar."
  },

  // =====================================================================
  //  BURADAN SONRASI: EKLENEN 17 YENİ PATTERN
  // =====================================================================

  // ------------------------- CREATIONAL -------------------------
  {
    id: "abstract-factory",
    name: "Abstract Factory",
    category: "Creational",
    description: "Birbiriyle uyumlu nesne ailelerini, somut sınıflarını belirtmeden üretmenizi sağlayan yaratıcılık kalıbıdır.",
    problem: "Arayüzünüzde Windows ve Mac görünümü olsun. Buton, onay kutusu gibi bileşenlerin hepsi aynı aileden gelmelidir. Windows butonunun yanına Mac onay kutusu koyarsanız görüntü bozulur. Nesneleri tek tek 'new' ile oluşturursanız aileleri karıştırma riskiniz vardır.",
    whenToUse: "Birlikte kullanılması gereken ilişkili nesne aileleriniz varsa ve kodunuzun bu nesnelerin somut sınıflarına bağımlı olmasını istemiyorsanız kullanılır.",
    whenNotToUse: "Tek bir ürün türü üretiyorsanız Factory Method yeterlidir. Aileye sık sık yeni ürün türü eklemeniz gerekecekse de zorlayıcı olur.",
    realWorld: "Bir mobilya mağazasındaki 'Modern' ve 'Klasik' koleksiyonlar. Koleksiyonu seçtiğinizde koltuk, sehpa ve masa aynı stilde gelir.",
    code: `// 1. Ürün arayüzleri
public interface IButton
{
    void Render();
}

public interface ICheckbox
{
    void Render();
}

// 2. Windows ailesi
public class WindowsButton : IButton
{
    public void Render() => Console.WriteLine("Windows butonu çizildi.");
}

public class WindowsCheckbox : ICheckbox
{
    public void Render() => Console.WriteLine("Windows onay kutusu çizildi.");
}

// 3. Mac ailesi
public class MacButton : IButton
{
    public void Render() => Console.WriteLine("Mac butonu çizildi.");
}

public class MacCheckbox : ICheckbox
{
    public void Render() => Console.WriteLine("Mac onay kutusu çizildi.");
}

// 4. Abstract Factory: bir ailenin tüm ürünlerini üretir
public interface IUIFactory
{
    IButton CreateButton();
    ICheckbox CreateCheckbox();
}

public class WindowsFactory : IUIFactory
{
    public IButton CreateButton() => new WindowsButton();
    public ICheckbox CreateCheckbox() => new WindowsCheckbox();
}

public class MacFactory : IUIFactory
{
    public IButton CreateButton() => new MacButton();
    public ICheckbox CreateCheckbox() => new MacCheckbox();
}

// 5. İstemci: hangi aile olduğunu bilmez
public class Application
{
    private readonly IButton _button;
    private readonly ICheckbox _checkbox;

    public Application(IUIFactory factory)
    {
        _button = factory.CreateButton();
        _checkbox = factory.CreateCheckbox();
    }

    public void Draw()
    {
        _button.Render();
        _checkbox.Render();
    }
}

// Kullanımı:
// IUIFactory factory = new MacFactory();
// new Application(factory).Draw();`,
    explanation: [
      "IButton / ICheckbox: Farklı ürün türlerinin ortak arayüzleridir.",
      "WindowsButton, MacButton vb.: Her ailenin kendi somut ürünleridir.",
      "IUIFactory: Bir ailenin üretebileceği tüm ürünleri (buton, onay kutusu) tek arayüzde toplar.",
      "Application: Yalnızca arayüzlerle çalışır. Fabrikayı değiştirmek, tüm bileşenlerin birlikte değişmesi için yeterlidir."
    ],
    pros: ["Fabrikadan çıkan ürünlerin birbiriyle uyumlu olduğundan emin olursunuz.", "İstemci kodu somut sınıflara bağlı kalmaz.", "Yeni bir ürün ailesi eklemek kolaydır (yeni bir fabrika yazılır)."],
    cons: ["Aileye yeni bir ürün türü eklemek zordur, arayüz ve tüm fabrikalar değişir.", "Çok sayıda arayüz ve sınıf oluştuğu için kod hacmi artar."],
    related: ["Factory Method", "Builder", "Prototype"],
    uml: "[ Client ] ---> [ IUIFactory ] <|-- [ WindowsFactory, MacFactory ] ---> [ IButton, ICheckbox ]",
    summary: "Abstract Factory, birbiriyle uyumlu nesne ailelerini tek bir fabrika arayüzü üzerinden üretir. Aile değişimi kolaylaşır, ancak aileye yeni ürün türü eklemek daha maliyetlidir."
  },
  {
    id: "prototype",
    name: "Prototype",
    category: "Creational",
    description: "Var olan bir nesneyi kopyalayarak yeni nesneler üretmenizi sağlayan, kodunuzu nesnenin sınıfına bağımlı hale getirmeyen yaratıcılık kalıbıdır.",
    problem: "Bir oyunda yüzlerce düşman üretmeniz gerekiyor ve hepsi aynı başlangıç ayarlarına sahip. Her birini sıfırdan kurmak hem yavaştır hem de tekrar eden koda yol açar. Ayrıca bir nesnenin private alanlarını dışarıdan kopyalamak mümkün değildir.",
    whenToUse: "Nesneyi sıfırdan oluşturmak pahalıysa (örneğin veritabanından yükleme) veya birbirine çok benzeyen nesneleri küçük farklarla çoğaltmak istiyorsanız kullanılır.",
    whenNotToUse: "Nesneleriniz basitse ve sıfırdan oluşturmak ucuzsa gerek yoktur. Döngüsel referanslar içeren karmaşık nesnelerde derin kopya yazmak da zorlaşır.",
    realWorld: "Bir belge şablonu. Her seferinde boş sayfadan başlamak yerine şablonu kopyalar, sadece isim ve tarihi değiştirirsiniz.",
    code: `public interface IPrototype<T>
{
    T Clone();
}

public class Enemy : IPrototype<Enemy>
{
    public string Name { get; set; }
    public int Health { get; set; }
    public List<string> Skills { get; set; } = new List<string>();

    // Derin kopya: liste de yeniden oluşturulur
    public Enemy Clone()
    {
        return new Enemy
        {
            Name = Name,
            Health = Health,
            Skills = new List<string>(Skills)
        };
    }

    public override string ToString() =>
        $"{Name} (Can: {Health}) Yetenekler: {string.Join(", ", Skills)}";
}

// Kullanımı:
// var orc = new Enemy { Name = "Ork", Health = 100 };
// orc.Skills.Add("Balta darbesi");
//
// Enemy commander = orc.Clone();
// commander.Name = "Ork Komutanı";
// commander.Health = 250;
// commander.Skills.Add("Savaş çığlığı");
//
// Console.WriteLine(orc);        // Ork (Can: 100) Yetenekler: Balta darbesi
// Console.WriteLine(commander);  // Ork Komutanı (Can: 250) Yetenekler: Balta darbesi, Savaş çığlığı`,
    explanation: [
      "IPrototype<T>: Kopyalanabilir nesneler için ortak sözleşmeyi tanımlar.",
      "Clone(): Yeni bir Enemy oluşturur ve alanları kopyalar. Skills listesi için yeni bir liste yaratıldığı için buna derin kopya (deep copy) denir.",
      "Listeyi yeniden oluşturmasaydık iki düşman aynı listeyi paylaşırdı ve birine yetenek eklemek diğerini de etkilerdi (yüzeysel kopya sorunu).",
      "Kullanım örneğinde orijinal 'orc' değişmeden kalır, kopya bağımsız olarak özelleştirilir."
    ],
    pros: ["Karmaşık nesneleri sıfırdan kurmadan hızlıca çoğaltırsınız.", "Somut sınıflara bağımlı kalmadan kopyalama yapabilirsiniz.", "Hazır ayarlı nesneleri şablon olarak saklayabilirsiniz."],
    cons: ["Döngüsel referansı olan nesnelerde derin kopya yazmak zordur.", "Her sınıf için Clone() yazmak ve güncel tutmak gerekir. Yeni alan eklenince kopyaya eklemeyi unutmak kolaydır."],
    related: ["Factory Method", "Abstract Factory", "Memento"],
    uml: "[ Client ] ---> [ IPrototype | + Clone() ] <|-- [ ConcretePrototype ]",
    summary: "Prototype, hazır bir nesneyi kopyalayarak yenisini üretir. Sık kullanılan başlangıç ayarlarını çoğaltmak için pratiktir, ancak kopyanın derin mi yüzeysel mi olduğuna dikkat etmek gerekir."
  },

  // ------------------------- STRUCTURAL -------------------------
  {
    id: "bridge",
    name: "Bridge",
    category: "Structural",
    description: "Büyük bir sınıfı ya da birbiriyle ilişkili sınıf grubunu, birbirinden bağımsız gelişebilen iki ayrı hiyerarşiye (soyutlama ve uygulama) ayıran yapısal kalıptır.",
    problem: "Farklı cihazlar (TV, Radyo) ve farklı kumandalar (Basit, Gelişmiş) düşünün. Her kombinasyon için ayrı sınıf yazarsanız SimpleTvRemote, AdvancedTvRemote, SimpleRadioRemote... diye sınıf sayısı katlanarak artar.",
    whenToUse: "Bir sınıf iki bağımsız yönde çeşitleniyorsa veya soyutlamayı ile uygulamayı ayrı ayrı geliştirmek istiyorsanız kullanılır.",
    whenNotToUse: "Sınıfınız zaten tek yönde gelişiyorsa ve sabit bir yapıya sahipse gereksiz karmaşıklık yaratır.",
    realWorld: "Bir televizyon kumandası ile televizyon arasındaki ilişki. Kumanda türü ile cihaz türü birbirinden bağımsızdır, ikisi de standart bir sinyal arayüzü üzerinden konuşur.",
    code: `// 1. Uygulama (Implementor) arayüzü
public interface IDevice
{
    bool IsOn { get; }
    int Volume { get; set; }
    void TurnOn();
    void TurnOff();
}

public class Tv : IDevice
{
    public bool IsOn { get; private set; }
    public int Volume { get; set; } = 10;
    public void TurnOn() { IsOn = true; Console.WriteLine("TV açıldı."); }
    public void TurnOff() { IsOn = false; Console.WriteLine("TV kapandı."); }
}

public class Radio : IDevice
{
    public bool IsOn { get; private set; }
    public int Volume { get; set; } = 5;
    public void TurnOn() { IsOn = true; Console.WriteLine("Radyo açıldı."); }
    public void TurnOff() { IsOn = false; Console.WriteLine("Radyo kapandı."); }
}

// 2. Soyutlama (Abstraction): köprü, _device alanıdır
public class RemoteControl
{
    protected readonly IDevice _device;

    public RemoteControl(IDevice device)
    {
        _device = device;
    }

    public void TogglePower()
    {
        if (_device.IsOn) _device.TurnOff();
        else _device.TurnOn();
    }

    public void VolumeUp() => _device.Volume += 10;
}

// 3. Genişletilmiş soyutlama
public class AdvancedRemote : RemoteControl
{
    public AdvancedRemote(IDevice device) : base(device) { }

    public void Mute()
    {
        _device.Volume = 0;
        Console.WriteLine("Ses kapatıldı.");
    }
}

// Kullanımı:
// var tvRemote = new AdvancedRemote(new Tv());
// tvRemote.TogglePower();   // TV açıldı.
// tvRemote.Mute();          // Ses kapatıldı.
//
// var radioRemote = new RemoteControl(new Radio());
// radioRemote.TogglePower(); // Radyo açıldı.`,
    explanation: [
      "IDevice: Uygulama tarafını tanımlar. Tv ve Radio bu arayüzün farklı gerçekleştirmeleridir.",
      "RemoteControl: Soyutlama tarafıdır. İçindeki _device referansı iki hiyerarşi arasındaki köprüdür.",
      "AdvancedRemote: Kumanda hiyerarşisini, cihazlara dokunmadan genişletir.",
      "Yeni bir cihaz eklemek için sadece IDevice'ı uygulayan bir sınıf yazılır. Yeni bir kumanda için sadece kumanda sınıfı türetilir. Kombinasyon sınıfına gerek kalmaz."
    ],
    pros: ["Sınıf sayısının kombinasyonlarla katlanarak artmasını önler.", "Soyutlama ve uygulama birbirinden bağımsız geliştirilir.", "Uygulama çalışma zamanında değiştirilebilir."],
    cons: ["Zaten tek yönde gelişen bir sınıfa uygulanırsa gereksiz karmaşıklık yaratır.", "İlk bakışta anlaşılması sıradan kalıtım kadar kolay değildir."],
    related: ["Adapter", "Strategy", "State"],
    uml: "[ Abstraction (has Implementor) ] <|-- [ RefinedAbstraction ]   ---->   [ Implementor ] <|-- [ ConcreteImplementorA, B ]",
    summary: "Bridge, soyutlama ile uygulamayı iki ayrı hiyerarşiye bölerek ikisinin birbirinden bağımsız büyümesini sağlar ve sınıf patlamasını önler."
  },
  {
    id: "composite",
    name: "Composite",
    category: "Structural",
    description: "Nesneleri ağaç yapısında birleştirmenizi ve tekil nesnelerle nesne gruplarına aynı şekilde davranmanızı sağlayan yapısal kalıptır.",
    problem: "Bir klasörün toplam boyutunu hesaplamak istiyorsunuz. Klasör içinde dosyalar ve başka klasörler olabilir. Her seferinde 'bu dosya mı klasör mü?' diye kontrol etmek kodu karmaşıklaştırır.",
    whenToUse: "Uygulamanızın çekirdek modeli ağaç yapısı olarak ifade edilebiliyorsa (klasörler, menüler, organizasyon şeması) ve istemcinin tekil ve grup nesneleri aynı şekilde kullanmasını istiyorsanız kullanılır.",
    whenNotToUse: "Nesneleriniz arasında ağaç ilişkisi yoksa veya yaprak ile bileşik nesnelerin arayüzleri birbirinden çok farklıysa uygun değildir.",
    realWorld: "Bir şirketin organizasyon şeması. Bir müdürün maaş bütçesini sorduğunuzda kendi maaşı ve altındaki tüm çalışanların maaşları toplanır. Siz ise tek bir soru sorarsınız.",
    code: `public interface IFileSystemItem
{
    string Name { get; }
    long GetSize();
    void Print(int indent = 0);
}

// Yaprak (Leaf)
public class FileItem : IFileSystemItem
{
    private readonly long _size;
    public string Name { get; }

    public FileItem(string name, long size)
    {
        Name = name;
        _size = size;
    }

    public long GetSize() => _size;

    public void Print(int indent = 0) =>
        Console.WriteLine($"{new string(' ', indent)}- {Name} ({_size} KB)");
}

// Bileşik (Composite)
public class Folder : IFileSystemItem
{
    private readonly List<IFileSystemItem> _items = new List<IFileSystemItem>();
    public string Name { get; }

    public Folder(string name)
    {
        Name = name;
    }

    public void Add(IFileSystemItem item) => _items.Add(item);

    public long GetSize()
    {
        long total = 0;
        foreach (var item in _items)
            total += item.GetSize();
        return total;
    }

    public void Print(int indent = 0)
    {
        Console.WriteLine($"{new string(' ', indent)}+ {Name}/ ({GetSize()} KB)");
        foreach (var item in _items)
            item.Print(indent + 2);
    }
}

// Kullanımı:
// var root = new Folder("Projem");
// var src = new Folder("src");
// src.Add(new FileItem("Program.cs", 12));
// src.Add(new FileItem("Utils.cs", 8));
// root.Add(src);
// root.Add(new FileItem("README.md", 3));
// root.Print();
// Console.WriteLine(root.GetSize()); // 23`,
    explanation: [
      "IFileSystemItem: Hem dosyanın hem klasörün uyguladığı ortak arayüzdür.",
      "FileItem: Ağacın yaprağıdır. Kendi boyutunu döndürür.",
      "Folder: Alt öğelerinin listesini tutar. GetSize() çağrıldığında her alt öğenin GetSize() metodunu çağırıp toplar. Alt öğe klasörse aynı işlem içeride tekrarlanır.",
      "İstemci, root.GetSize() yazarken yapının derinliğini bilmek zorunda değildir."
    ],
    pros: ["Karmaşık ağaç yapılarıyla özyinelemeli (recursive) olarak rahatça çalışırsınız.", "Yeni öğe türleri eklemek kolaydır (Open/Closed).", "İstemci kodu tek bir arayüzle çalışır."],
    cons: ["Çok farklı işlevlere sahip sınıflar için ortak bir arayüz tasarlamak zor olabilir.", "Arayüzü aşırı genel yaparsanız tip güvenliği azalır."],
    related: ["Decorator", "Iterator", "Visitor"],
    uml: "[ Client ] ---> [ IComponent ] <|-- [ Leaf ]  &  [ IComponent ] <|-- [ Composite (has children: IComponent) ]",
    summary: "Composite, parça-bütün ilişkisini ağaç yapısıyla ifade eder ve tekil ile grup nesnelere aynı şekilde davranmanızı sağlar."
  },
  {
    id: "facade",
    name: "Facade",
    category: "Structural",
    description: "Karmaşık bir alt sistem için basit, tek noktalı bir arayüz sunan yapısal kalıptır.",
    problem: "Bir sipariş verildiğinde stok kontrol edilmeli, ödeme alınmalı ve kargo oluşturulmalıdır. Bu üç servisi çağıran kod her yerde tekrarlanırsa hem karmaşıklaşır hem de bir servis değiştiğinde onlarca yer güncellenmek zorunda kalır.",
    whenToUse: "Karmaşık bir alt sisteme sınırlı ve basit bir arayüz sağlamak veya sistemi katmanlara ayırıp her katmana tek giriş noktası tanımlamak istediğinizde kullanılır.",
    whenNotToUse: "Alt sistem zaten basitse veya istemcilerin alt sistemin tüm ayrıntılarına ihtiyacı varsa gereksiz bir katman olur.",
    realWorld: "Bir müşteri hizmetleri hattı. 'Kargomu iptal etmek istiyorum' dersiniz. Arka planda depo, muhasebe ve lojistik ile görüşmek zorunda kalmazsınız, tek bir kişi hepsini sizin yerinize halleder.",
    code: `// Alt sistem sınıfları
public class InventoryService
{
    public bool IsInStock(string product)
    {
        Console.WriteLine($"Stok kontrol edildi: {product}");
        return true;
    }
}

public class PaymentService
{
    public bool Charge(string customer, decimal amount)
    {
        Console.WriteLine($"{customer} kişisinden {amount} TL çekildi.");
        return true;
    }
}

public class ShippingService
{
    public void CreateShipment(string product, string address)
    {
        Console.WriteLine($"Kargo oluşturuldu: {product} -> {address}");
    }
}

// Facade: karmaşıklığı tek metodun arkasına saklar
public class OrderFacade
{
    private readonly InventoryService _inventory = new InventoryService();
    private readonly PaymentService _payment = new PaymentService();
    private readonly ShippingService _shipping = new ShippingService();

    public bool PlaceOrder(string customer, string product, decimal price, string address)
    {
        if (!_inventory.IsInStock(product))
        {
            Console.WriteLine("Ürün stokta yok.");
            return false;
        }

        if (!_payment.Charge(customer, price))
        {
            Console.WriteLine("Ödeme başarısız.");
            return false;
        }

        _shipping.CreateShipment(product, address);
        return true;
    }
}

// Kullanımı:
// var orders = new OrderFacade();
// orders.PlaceOrder("Ayşe", "Klavye", 750m, "İstanbul");`,
    explanation: [
      "InventoryService, PaymentService, ShippingService: Alt sistemin parçalarıdır. Her biri kendi işini yapar.",
      "OrderFacade: Bu üç servisi doğru sırayla çağırır ve olası hata durumlarını yönetir.",
      "İstemci yalnızca PlaceOrder metodunu çağırır, alt sistemin nasıl çalıştığını bilmesi gerekmez.",
      "Alt sistemler hâlâ doğrudan kullanılabilir. Facade zorunlu bir kapı değil, kolaylaştırıcı bir kısayoldur."
    ],
    pros: ["Karmaşık alt sistemi istemciden izole eder.", "Kod tekrarını azaltır ve kullanımı kolaylaştırır.", "Alt sistem değişse bile istemci etkilenmez."],
    cons: ["Facade sınıfı zamanla her şeyi bilen büyük bir sınıfa (God object) dönüşebilir.", "Alt sistemin tüm özelliklerini sunmaz, gerekirse doğrudan alt sisteme inmek gerekir."],
    related: ["Adapter", "Mediator", "Singleton"],
    uml: "[ Client ] ---> [ Facade ] ---> [ SubsystemA, SubsystemB, SubsystemC ]",
    summary: "Facade, karmaşık bir sistemi basit bir arayüzün arkasına saklar. İstemcinin işini kolaylaştırır ve alt sistemle olan bağımlılığı azaltır."
  },
  {
    id: "flyweight",
    name: "Flyweight",
    category: "Structural",
    description: "Çok sayıda benzer nesnenin ortak verilerini paylaştırarak bellek kullanımını azaltan yapısal kalıptır.",
    problem: "Bir oyunda yüz binlerce ağaç çizmek istiyorsunuz. Her ağaç nesnesi isim, renk ve doku gibi ağır verileri kendi içinde tutarsa bellek hızla tükenir. Oysa ağaçların büyük çoğunluğu birkaç türden ibarettir.",
    whenToUse: "Uygulamanız çok sayıda benzer nesne üretiyor, bellek yetersiz kalıyor ve nesnelerin büyük bölümü ortak, değişmeyen verilere sahipse kullanılır.",
    whenNotToUse: "Nesne sayısı az ise veya bellek gerçekten bir sorun değilse kod karmaşıklığını boşuna artırır.",
    realWorld: "Bir kitaptaki harfler. Her 'a' harfi için ayrı bir şekil dosyası saklamak yerine harfin şekli bir kez tutulur ve sayfada her kullanıldığında sadece konumu belirtilir.",
    code: `// Flyweight: paylaşılan, değişmeyen veri
public class TreeType
{
    public string Name { get; }
    public string Color { get; }
    public string Texture { get; }

    public TreeType(string name, string color, string texture)
    {
        Name = name;
        Color = color;
        Texture = texture;
    }

    public void Draw(int x, int y) =>
        Console.WriteLine($"{Name} ({Color}) çizildi -> ({x}, {y})");
}

// Fabrika: aynı türü tekrar oluşturmak yerine paylaşır
public class TreeTypeFactory
{
    private readonly Dictionary<string, TreeType> _types = new Dictionary<string, TreeType>();

    public TreeType Get(string name, string color, string texture)
    {
        string key = $"{name}-{color}-{texture}";

        if (!_types.ContainsKey(key))
            _types[key] = new TreeType(name, color, texture);

        return _types[key];
    }

    public int TypeCount => _types.Count;
}

// Her ağaç yalnızca kendine özgü veriyi (konumu) taşır
public class Tree
{
    private readonly int _x;
    private readonly int _y;
    private readonly TreeType _type;

    public Tree(int x, int y, TreeType type)
    {
        _x = x;
        _y = y;
        _type = type;
    }

    public void Draw() => _type.Draw(_x, _y);
}

// Kullanımı:
// var factory = new TreeTypeFactory();
// var forest = new List<Tree>();
// for (int i = 0; i < 1000; i++)
// {
//     var type = factory.Get("Çam", "Yeşil", "cam.png");
//     forest.Add(new Tree(i, i * 2, type));
// }
// Console.WriteLine(forest.Count);      // 1000
// Console.WriteLine(factory.TypeCount); // 1`,
    explanation: [
      "TreeType: Paylaşılan (intrinsic) veriyi tutar: isim, renk, doku. Bu nesne değişmezdir (immutable).",
      "TreeTypeFactory: Daha önce oluşturulmuş bir tür varsa onu geri verir, yoksa yenisini oluşturup saklar.",
      "Tree: Yalnızca kendine özgü (extrinsic) veriyi, yani konumunu tutar ve çizim için TreeType'a başvurur.",
      "Kullanım örneğinde 1000 ağaç oluşturulur ama bellekte yalnızca 1 tane TreeType bulunur. Tasarruf buradan gelir."
    ],
    pros: ["Çok sayıda nesne olduğunda bellek kullanımını ciddi biçimde azaltır.", "Paylaşılan verilerin tek yerde yönetilmesini sağlar."],
    cons: ["Bellek kazancı için kod karmaşıklığı artar.", "Ortak ve özel verileri ayırmak zorunda kalırsınız. Paylaşılan nesne değiştirilebilirse hatalara yol açar."],
    related: ["Singleton", "Composite", "Facade"],
    uml: "[ Client ] ---> [ FlyweightFactory (cache) ] ---> [ Flyweight (paylaşılan veri) ]   [ Context (konum) ] ---> [ Flyweight ]",
    summary: "Flyweight, çok sayıda benzer nesnenin ortak verisini paylaştırarak bellek tasarrufu sağlar. Yalnızca ölçülmüş bir bellek problemi varsa tercih edilmelidir."
  },
  {
    id: "proxy",
    name: "Proxy",
    category: "Structural",
    description: "Başka bir nesnenin yerine geçen bir vekil (substitute) sunarak o nesneye erişimi kontrol etmenizi sağlayan yapısal kalıptır.",
    problem: "Bir rapor servisi her çağrıldığında veritabanında yavaş bir sorgu çalıştırıyor. Aynı rapor tekrar istendiğinde sonucu yeniden hesaplamak gereksizdir. Ancak servisin koduna dokunmak istemiyorsunuz.",
    whenToUse: "Pahalı bir nesneyi yalnızca gerektiğinde oluşturmak (lazy loading), sonuçları önbelleğe almak veya erişim izni ve loglama gibi kontrolleri asıl nesneye dokunmadan eklemek istediğinizde kullanılır.",
    whenNotToUse: "Asıl nesne zaten hızlı ve basitse araya bir katman eklemek sadece kod sayısını ve gecikmeyi artırır.",
    realWorld: "Banka kartı. Kart, hesabınızın vekilidir. Her ödemede nakit taşımazsınız, kart hesabınıza erişimi temsil eder ve kontrol eder.",
    code: `public interface IReportService
{
    string GetReport(string name);
}

// Gerçek servis: yavaş çalışır
public class ReportService : IReportService
{
    public string GetReport(string name)
    {
        Console.WriteLine($"[Servis] '{name}' raporu hesaplanıyor...");
        Thread.Sleep(1000); // Ağır işlemi simüle eder
        return $"{name} raporunun içeriği";
    }
}

// Vekil: aynı arayüz, araya önbellek katmanı ekler
public class CachingReportProxy : IReportService
{
    private readonly IReportService _realService;
    private readonly Dictionary<string, string> _cache = new Dictionary<string, string>();

    public CachingReportProxy(IReportService realService)
    {
        _realService = realService;
    }

    public string GetReport(string name)
    {
        if (_cache.TryGetValue(name, out string cached))
        {
            Console.WriteLine($"[Proxy] '{name}' önbellekten döndü.");
            return cached;
        }

        string report = _realService.GetReport(name);
        _cache[name] = report;
        return report;
    }
}

// Kullanımı:
// IReportService service = new CachingReportProxy(new ReportService());
// service.GetReport("Aylık Satış"); // yavaş: hesaplanır
// service.GetReport("Aylık Satış"); // hızlı: önbellekten gelir`,
    explanation: [
      "IReportService: Hem gerçek servisin hem vekilin uyguladığı ortak arayüzdür. İstemci hangisini kullandığını bilmez.",
      "ReportService: İşin asıl sahibidir ve yavaştır. Thread.Sleep ağır işlemi simüle eder.",
      "CachingReportProxy: İsteği önce kendi önbelleğinde arar. Bulursa doğrudan döndürür, bulamazsa gerçek servise yönlendirir ve sonucu saklar.",
      "İlk çağrı yavaş, ikinci çağrı anında tamamlanır. Gerçek servisin kodu hiç değişmemiştir."
    ],
    pros: ["Asıl nesneyi değiştirmeden erişim, önbellek ve loglama gibi kontroller ekleyebilirsiniz.", "Asıl nesne hazır olmasa bile vekil çalışmaya devam edebilir.", "Open/Closed prensibine uyar."],
    cons: ["Yeni sınıflar eklendiği için kod karmaşıklaşır.", "Araya giren katman yüzünden yanıtta gecikme oluşabilir."],
    related: ["Adapter", "Decorator", "Facade"],
    uml: "[ Client ] ---> [ IService ] <|-- [ RealService ]  &  [ IService ] <|-- [ Proxy (has RealService) ]",
    summary: "Proxy, bir nesnenin yerine geçerek ona erişimi kontrol eder. Önbellek, yavaş yükleme ve yetkilendirme gibi ihtiyaçlarda asıl nesneyi değiştirmeden çözüm sağlar."
  },

  // ------------------------- BEHAVIORAL -------------------------
  {
    id: "chain-of-responsibility",
    name: "Chain of Responsibility",
    category: "Behavioral",
    description: "Bir isteği, onu işleyebilecek bir nesne bulunana kadar bir işleyici zinciri boyunca sırayla ileten davranışsal kalıptır.",
    problem: "Bir masraf onay sisteminde küçük tutarları takım lideri, orta tutarları müdür, büyük tutarları genel müdür onaylıyor. Bunu tek bir yerde uzun bir if-else zinciriyle yazarsanız her kural değişikliğinde aynı metoda dönmek zorunda kalırsınız.",
    whenToUse: "Bir isteği birden fazla nesne işleyebiliyorsa ve hangisinin işleyeceği önceden bilinmiyorsa, ya da işleyicilerin sırasını çalışma zamanında değiştirmek istiyorsanız kullanılır.",
    whenNotToUse: "İsteği kimin işleyeceği belliyse veya her isteğin mutlaka işlenmesi garanti edilmesi gerekiyorsa uygun değildir.",
    realWorld: "Müşteri hizmetlerini aradığınızda önce temsilci, çözemezse uzman, o da çözemezse yönetici devreye girer. Siz sadece talebinizi iletirsiniz, kimin çözeceğini zincir belirler.",
    code: `public abstract class Approver
{
    private Approver _next;

    public Approver SetNext(Approver next)
    {
        _next = next;
        return next; // Zinciri art arda kurabilmek için
    }

    public void Handle(decimal amount)
    {
        if (CanApprove(amount))
            Approve(amount);
        else if (_next != null)
            _next.Handle(amount);
        else
            Console.WriteLine($"{amount} TL için onaylayacak kimse bulunamadı.");
    }

    protected abstract bool CanApprove(decimal amount);
    protected abstract void Approve(decimal amount);
}

public class TeamLead : Approver
{
    protected override bool CanApprove(decimal amount) => amount <= 1000;
    protected override void Approve(decimal amount) =>
        Console.WriteLine($"Takım lideri {amount} TL'yi onayladı.");
}

public class Manager : Approver
{
    protected override bool CanApprove(decimal amount) => amount <= 10000;
    protected override void Approve(decimal amount) =>
        Console.WriteLine($"Müdür {amount} TL'yi onayladı.");
}

public class Director : Approver
{
    protected override bool CanApprove(decimal amount) => amount <= 100000;
    protected override void Approve(decimal amount) =>
        Console.WriteLine($"Genel müdür {amount} TL'yi onayladı.");
}

// Kullanımı:
// var lead = new TeamLead();
// lead.SetNext(new Manager()).SetNext(new Director());
//
// lead.Handle(500);      // Takım lideri onaylar
// lead.Handle(7500);     // Müdür onaylar
// lead.Handle(50000);    // Genel müdür onaylar
// lead.Handle(500000);   // Kimse onaylayamaz`,
    explanation: [
      "Approver: Tüm onaylayıcıların ortak tabanıdır. Handle metodu önce 'ben onaylayabilir miyim?' diye sorar. Evetse onaylar, hayırsa isteği bir sonrakine iletir.",
      "SetNext: Zinciri kurar ve aldığı nesneyi geri döndürür. Böylece lead.SetNext(...).SetNext(...) yazılabilir.",
      "TeamLead, Manager, Director: Her biri yalnızca kendi yetki sınırını bilir, diğerlerinden habersizdir.",
      "Yeni bir onay basamağı eklemek için yeni bir sınıf yazıp zincire eklemek yeterlidir."
    ],
    pros: ["İstek gönderen ile alıcı arasındaki bağımlılık azalır.", "Sıra ve sorumluluklar kolayca değiştirilebilir.", "Her sınıf tek bir işe odaklanır (Single Responsibility)."],
    cons: ["Bazı istekler hiçbir işleyiciye ulaşmadan sonlanabilir.", "Hata ayıklarken isteğin zincirin hangi halkasında işlendiğini takip etmek zor olabilir."],
    related: ["Command", "Mediator", "Observer"],
    uml: "[ Client ] ---> [ Handler (has next) ] <|-- [ ConcreteHandlerA ] -> [ ConcreteHandlerB ] -> [ ConcreteHandlerC ]",
    summary: "Chain of Responsibility, bir isteği işleyici zinciri boyunca ilerletir ve ilk uygun işleyici işi üstlenir. Sıra ve kuralları esnek biçimde yönetmek için kullanılır."
  },
  {
    id: "command",
    name: "Command",
    category: "Behavioral",
    description: "Bir isteği nesne olarak paketleyen, böylece istekleri sıraya almanıza, kaydetmenize ve geri almanıza izin veren davranışsal kalıptır.",
    problem: "Bir metin editöründe 'Yaz' ve 'Sil' gibi işlemler var ve kullanıcı Ctrl+Z ile geri alabilmeli. İşlemleri doğrudan metotlarla çağırırsanız neyin geri alınacağını takip etmek zorlaşır.",
    whenToUse: "Geri alma (undo) ve yeniden yapma (redo) özelliği eklemek, işlemleri sıraya koymak, ertelemek veya kaydetmek ya da işlemi başlatan ile yapan nesneyi birbirinden ayırmak istediğinizde kullanılır.",
    whenNotToUse: "Basit bir metot çağrısı yeterliyse ve geri alma, kuyruk gibi ihtiyaçlarınız yoksa fazladan katman eklemiş olursunuz.",
    realWorld: "Restoranda sipariş fişi. Garson isteğinizi bir fişe yazar ve fiş mutfağa gider. Fiş isteğin kendisidir: sıraya konulabilir, iptal edilebilir, kayda geçer.",
    code: `public interface ICommand
{
    void Execute();
    void Undo();
}

// Receiver: işi gerçekten yapan sınıf
public class TextEditor
{
    public string Text { get; private set; } = "";

    public void Append(string value) => Text += value;

    public void RemoveLast(int count) =>
        Text = Text.Substring(0, Text.Length - count);
}

public class AppendCommand : ICommand
{
    private readonly TextEditor _editor;
    private readonly string _value;

    public AppendCommand(TextEditor editor, string value)
    {
        _editor = editor;
        _value = value;
    }

    public void Execute() => _editor.Append(_value);
    public void Undo() => _editor.RemoveLast(_value.Length);
}

// Invoker: komutları çalıştırır ve geçmişi tutar
public class CommandHistory
{
    private readonly Stack<ICommand> _history = new Stack<ICommand>();

    public void Run(ICommand command)
    {
        command.Execute();
        _history.Push(command);
    }

    public void UndoLast()
    {
        if (_history.Count == 0) return;
        _history.Pop().Undo();
    }
}

// Kullanımı:
// var editor = new TextEditor();
// var history = new CommandHistory();
//
// history.Run(new AppendCommand(editor, "Merhaba"));
// history.Run(new AppendCommand(editor, " Dünya"));
// Console.WriteLine(editor.Text); // Merhaba Dünya
//
// history.UndoLast();
// Console.WriteLine(editor.Text); // Merhaba`,
    explanation: [
      "ICommand: Her komutun Execute ve Undo metotlarına sahip olmasını sağlar.",
      "TextEditor (Receiver): Gerçek işi yapan sınıftır. Komutlar onu çağırır.",
      "AppendCommand: 'Şu metni ekle' isteğini bir nesneye çevirir. Geri almak için eklenen metnin uzunluğu kadar karakteri siler.",
      "CommandHistory (Invoker): Çalıştırılan komutları yığında (Stack) saklar. UndoLast en son komutu geri alır."
    ],
    pros: ["Geri alma ve yeniden yapma özelliklerini kolaylaştırır.", "İşlemleri sıraya alma, geciktirme ve kaydetme imkânı verir.", "Yeni komutlar mevcut kodu değiştirmeden eklenir."],
    cons: ["Her işlem için ayrı bir sınıf yazıldığından kod hacmi artar.", "Basit bir çağrı için fazla katman ekleyebilir."],
    related: ["Chain of Responsibility", "Memento", "Observer"],
    uml: "[ Invoker ] ---> [ ICommand | + Execute() + Undo() ] <|-- [ ConcreteCommand ] ---> [ Receiver ]",
    summary: "Command, bir isteği nesneye dönüştürür. Bu sayede işlemler saklanabilir, sıraya alınabilir ve geri alınabilir. Özellikle undo/redo gereken uygulamalarda çok işe yarar."
  },
  {
    id: "interpreter",
    name: "Interpreter",
    category: "Behavioral",
    description: "Bir dilin dilbilgisini (grammar) nesnelerle temsil eden ve bu dildeki ifadeleri yorumlayan davranışsal kalıptır.",
    problem: "Uygulamanızda kullanıcıdan '10 5 + 3 -' gibi basit bir ifade alıp sonucunu hesaplamanız gerekiyor. Her ifade türünü uzun if-else ve string işlemleriyle çözmek, dil kuralları çoğaldıkça yönetilemez hale gelir.",
    whenToUse: "Basit ve sık tekrarlanan bir dil ya da kural seti varsa (arama filtreleri, matematiksel ifadeler, basit komut dilleri) ve dilbilgisi küçükse kullanılır.",
    whenNotToUse: "Dilbilgisi karmaşıksa sınıf sayısı hızla artar ve yönetimi zorlaşır. Bu durumda ayrıştırıcı (parser) araçları ya da hazır kütüphaneler daha uygundur.",
    realWorld: "Bir çevirmen ya da nota okuyan müzisyen. Yazılı sembolleri (nota) kurallara göre anlamlandırır ve sese dönüştürür.",
    code: `public interface IExpression
{
    int Interpret();
}

// Terminal ifade: sayı
public class NumberExpression : IExpression
{
    private readonly int _value;

    public NumberExpression(int value)
    {
        _value = value;
    }

    public int Interpret() => _value;
}

// Terminal olmayan ifadeler: iki alt ifadeyi birleştirir
public class AddExpression : IExpression
{
    private readonly IExpression _left;
    private readonly IExpression _right;

    public AddExpression(IExpression left, IExpression right)
    {
        _left = left;
        _right = right;
    }

    public int Interpret() => _left.Interpret() + _right.Interpret();
}

public class SubtractExpression : IExpression
{
    private readonly IExpression _left;
    private readonly IExpression _right;

    public SubtractExpression(IExpression left, IExpression right)
    {
        _left = left;
        _right = right;
    }

    public int Interpret() => _left.Interpret() - _right.Interpret();
}

// Yazıyı ifade ağacına çeviren basit ayrıştırıcı (postfix: "10 5 + 3 -")
public static class ExpressionParser
{
    public static IExpression Parse(string postfix)
    {
        var stack = new Stack<IExpression>();

        foreach (string token in postfix.Split(' '))
        {
            switch (token)
            {
                case "+":
                {
                    IExpression right = stack.Pop();
                    IExpression left = stack.Pop();
                    stack.Push(new AddExpression(left, right));
                    break;
                }
                case "-":
                {
                    IExpression right = stack.Pop();
                    IExpression left = stack.Pop();
                    stack.Push(new SubtractExpression(left, right));
                    break;
                }
                default:
                    stack.Push(new NumberExpression(int.Parse(token)));
                    break;
            }
        }

        return stack.Pop();
    }
}

// Kullanımı:
// IExpression expression = ExpressionParser.Parse("10 5 + 3 -");
// Console.WriteLine(expression.Interpret()); // (10 + 5) - 3 = 12`,
    explanation: [
      "IExpression: Dildeki her ifadenin uyguladığı ortak arayüzdür. Interpret() ifadenin sonucunu hesaplar.",
      "NumberExpression: Terminal ifadedir. Başka ifade içermez, doğrudan değerini döndürür.",
      "AddExpression / SubtractExpression: Terminal olmayan ifadelerdir. İki alt ifadeyi tutar ve Interpret() içinde onları yorumlayarak sonucu birleştirir.",
      "ExpressionParser: '10 5 + 3 -' yazısını okuyup bir ifade ağacına dönüştürür. Sonra tek bir Interpret() çağrısı tüm ağacı hesaplar."
    ],
    pros: ["Dilbilgisine yeni kural eklemek kolaydır, sadece yeni bir ifade sınıfı yazılır.", "Her kural ayrı bir sınıfta olduğu için okunması ve test edilmesi kolaydır."],
    cons: ["Karmaşık dilbilgilerinde çok sayıda sınıf oluşur ve yönetimi zorlaşır.", "Performans açısından büyük ifadelerde özel ayrıştırıcılara göre yavaş kalabilir."],
    related: ["Composite", "Iterator", "Visitor"],
    uml: "[ Client ] ---> [ IExpression | + Interpret() ] <|-- [ TerminalExpression ]  &  [ IExpression ] <|-- [ NonTerminalExpression (has IExpression) ]",
    summary: "Interpreter, küçük bir dilin kurallarını sınıflara bölerek ifadeleri yorumlamanızı sağlar. Basit dil ihtiyaçları için sade bir çözümdür, büyük diller için uygun değildir."
  },
  {
    id: "iterator",
    name: "Iterator",
    category: "Behavioral",
    description: "Bir koleksiyonun iç yapısını göstermeden elemanlarını tek tek dolaşmanızı sağlayan davranışsal kalıptır.",
    problem: "Bir müzik çalma listesindeki şarkıları dolaşmak istiyorsunuz. Liste dizi mi, bağlı liste mi, ağaç mı olduğuna göre dolaşma kodu değişir ve istemci bu ayrıntıları bilmek zorunda kalır.",
    whenToUse: "Koleksiyonun iç yapısını istemciden gizlemek, aynı koleksiyonu farklı biçimlerde dolaşmak (ters sıra, filtreli) veya farklı koleksiyonları aynı şekilde dolaşmak istediğinizde kullanılır.",
    whenNotToUse: "Koleksiyonunuz çok basitse ve sadece tek bir şekilde dolaşılıyorsa gerek yoktur. C#'ta çoğu durumda hazır List ve foreach yeterlidir.",
    realWorld: "Müzede rehberli tur. Rehber size sergi salonlarının haritasını vermez, sadece sıradaki esere götürür. Salonların nasıl düzenlendiğini bilmeden tüm eserleri gezersiniz.",
    code: `public class Song
{
    public string Title { get; }
    public string Artist { get; }

    public Song(string title, string artist)
    {
        Title = title;
        Artist = artist;
    }
}

// C#'ta Iterator kalıbı dile yerleşiktir: IEnumerable + yield return + foreach
public class Playlist : IEnumerable<Song>
{
    private readonly List<Song> _songs = new List<Song>();

    public void Add(Song song) => _songs.Add(song);

    // Varsayılan dolaşma: baştan sona
    public IEnumerator<Song> GetEnumerator()
    {
        foreach (var song in _songs)
            yield return song;
    }

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

    // Özel dolaşma: sondan başa
    public IEnumerable<Song> Reverse()
    {
        for (int i = _songs.Count - 1; i >= 0; i--)
            yield return _songs[i];
    }

    // Özel dolaşma: sadece belirli sanatçı
    public IEnumerable<Song> ByArtist(string artist)
    {
        foreach (var song in _songs)
            if (song.Artist == artist)
                yield return song;
    }
}

// Kullanımı:
// var playlist = new Playlist();
// playlist.Add(new Song("Şarkı A", "Sanatçı 1"));
// playlist.Add(new Song("Şarkı B", "Sanatçı 2"));
// playlist.Add(new Song("Şarkı C", "Sanatçı 1"));
//
// foreach (var song in playlist)                    // A, B, C
//     Console.WriteLine(song.Title);
//
// foreach (var song in playlist.Reverse())          // C, B, A
//     Console.WriteLine(song.Title);
//
// foreach (var song in playlist.ByArtist("Sanatçı 1")) // A, C
//     Console.WriteLine(song.Title);`,
    explanation: [
      "IEnumerable<Song>: Playlist sınıfı bu arayüzü uygulayarak 'ben dolaşılabilirim' der ve foreach ile kullanılabilir hale gelir.",
      "yield return: C#'ın iterator yazmayı kolaylaştıran özelliğidir. Derleyici gerekli durum makinesini sizin yerinize üretir.",
      "Reverse ve ByArtist: Aynı koleksiyonu farklı biçimlerde dolaşır. İç listenin bir List olduğu dışarıdan görünmez.",
      "İç yapıyı yarın başka bir koleksiyona çevirseniz bile foreach yazan kodlar aynen çalışmaya devam eder."
    ],
    pros: ["Dolaşma kodu koleksiyondan ayrılır (Single Responsibility).", "Aynı koleksiyonu farklı şekillerde dolaşabilirsiniz.", "İç yapı gizli kalır, istemci ona bağımlı olmaz."],
    cons: ["Basit koleksiyonlar için gereksiz olabilir.", "Özel bir iterator, bazı durumlarda doğrudan dolaşmaktan biraz daha yavaş olabilir."],
    related: ["Composite", "Visitor", "Memento"],
    uml: "[ Client ] ---> [ IEnumerable | + GetEnumerator() ] <|-- [ Playlist ] ---> [ IEnumerator | + Current + MoveNext() ]",
    summary: "Iterator, koleksiyonun iç yapısını ortaya çıkarmadan elemanlarına sırayla erişmeyi sağlar. C#'ta IEnumerable, yield return ve foreach bu kalıbı zaten sunar."
  },
  {
    id: "mediator",
    name: "Mediator",
    category: "Behavioral",
    description: "Nesnelerin birbirleriyle doğrudan konuşmasını engelleyip iletişimi tek bir arabulucu üzerinden yürüten davranışsal kalıptır.",
    problem: "Bir sohbet odasında her kullanıcı diğer tüm kullanıcıların referansını tutarsa sistem 'herkes herkesle bağlı' hale gelir. Yeni bir kullanıcı eklemek herkesi etkiler ve nesneler birbirine sıkı sıkıya bağlanır.",
    whenToUse: "Birçok nesne birbirine karmaşık şekilde bağımlıysa ve bu bağımlılık ağını sadeleştirmek veya iletişim mantığını tek yerde toplamak istediğinizde kullanılır.",
    whenNotToUse: "Nesneler arasındaki iletişim çok basitse arabulucu gereksiz bir katman olur. Arabulucu zamanla her şeyi bilen dev bir sınıfa da dönüşebilir.",
    realWorld: "Havalimanı kulesi. Pilotlar birbirleriyle doğrudan konuşmaz, hepsi kule ile iletişim kurar. İnişleri ve kalkışları kule düzenler, uçaklar birbirini tanımak zorunda kalmaz.",
    code: `public interface IChatRoom
{
    void Register(User user);
    void Send(string message, User from);
}

public class ChatRoom : IChatRoom
{
    private readonly List<User> _users = new List<User>();

    public void Register(User user)
    {
        _users.Add(user);
        user.Room = this;
    }

    public void Send(string message, User from)
    {
        foreach (var user in _users)
        {
            if (user != from)
                user.Receive(message, from.Name);
        }
    }
}

public class User
{
    public string Name { get; }
    public IChatRoom Room { get; set; }

    public User(string name)
    {
        Name = name;
    }

    public void Say(string message)
    {
        Console.WriteLine($"{Name} yazdı: {message}");
        Room.Send(message, this);
    }

    public void Receive(string message, string from) =>
        Console.WriteLine($"  {Name} aldı ({from}): {message}");
}

// Kullanımı:
// var room = new ChatRoom();
// var ayse = new User("Ayşe");
// var mehmet = new User("Mehmet");
// var zeynep = new User("Zeynep");
//
// room.Register(ayse);
// room.Register(mehmet);
// room.Register(zeynep);
//
// ayse.Say("Herkese merhaba!");`,
    explanation: [
      "IChatRoom: Arabulucunun sözleşmesidir. Kullanıcılar sadece bu arayüzü bilir.",
      "ChatRoom: Tüm kullanıcıları tutar ve mesajı gönderen hariç herkese dağıtır.",
      "User: Diğer kullanıcıları tanımaz, mesajını odaya iletir. Bu, kullanıcılar arasındaki bağımlılığı ortadan kaldırır.",
      "Yeni kullanıcı eklemek ya da mesaj dağıtım kuralını değiştirmek (örneğin özel mesaj) yalnızca ChatRoom içinde yapılır."
    ],
    pros: ["Bileşenler arasındaki doğrudan bağımlılıklar azalır.", "İletişim mantığı tek yerde toplanır.", "Bileşenleri başka yerlerde yeniden kullanmak kolaylaşır."],
    cons: ["Arabulucu zamanla her şeyi bilen büyük bir sınıfa (God object) dönüşebilir.", "Tek noktaya bağımlılık yaratır, arabulucu hatalıysa tüm iletişim etkilenir."],
    related: ["Observer", "Facade", "Chain of Responsibility"],
    uml: "[ Component A ] <---> [ IMediator ] <|-- [ ConcreteMediator ] <---> [ Component B, C ]",
    summary: "Mediator, nesneler arasındaki karışık iletişimi tek bir arabulucuda toplar. Bağımlılıkları azaltır, ancak arabulucunun aşırı büyümemesine dikkat etmek gerekir."
  },
  {
    id: "memento",
    name: "Memento",
    category: "Behavioral",
    description: "Bir nesnenin iç durumunu, kapsüllemeyi (encapsulation) bozmadan kaydedip daha sonra geri yüklemenizi sağlayan davranışsal kalıptır.",
    problem: "Bir metin editöründe geri alma özelliği yazıyorsunuz. Editörün durumunu dışarıdan kopyalayabilmek için alanlarını herkese açmanız gerekir, bu da kapsüllemeyi bozar ve sınıfın iç yapısını dışarıya bağımlı hale getirir.",
    whenToUse: "Nesnenin önceki durumuna dönebilmeniz gerekiyorsa (undo, checkpoint, kaydetme noktası) ve nesnenin alanlarını doğrudan okumak kapsüllemeyi bozacaksa kullanılır.",
    whenNotToUse: "Durum çok büyükse veya çok sık kaydediliyorsa bellek tüketimi artar. Bu durumda yalnızca değişen kısımları saklamak (delta) daha uygun olabilir.",
    realWorld: "Video oyununda 'kaydet' dediğinizde oyunun o anki hali bir dosyaya yazılır ve daha sonra o noktaya dönebilirsiniz. Kayıt dosyasının içini bilmenize gerek yoktur.",
    code: `// Memento: değişmez durum anısı
public class EditorMemento
{
    public string Text { get; }

    public EditorMemento(string text)
    {
        Text = text;
    }
}

// Originator: durumu olan nesne
public class Editor
{
    public string Text { get; set; } = "";

    public EditorMemento Save() => new EditorMemento(Text);

    public void Restore(EditorMemento memento) => Text = memento.Text;
}

// Caretaker: anıları saklar ama içine bakmaz
public class History
{
    private readonly Stack<EditorMemento> _snapshots = new Stack<EditorMemento>();

    public void Push(EditorMemento memento) => _snapshots.Push(memento);

    public EditorMemento Pop() => _snapshots.Pop();
}

// Kullanımı:
// var editor = new Editor();
// var history = new History();
//
// editor.Text = "Birinci sürüm";
// history.Push(editor.Save());
//
// editor.Text = "İkinci sürüm";
// history.Push(editor.Save());
//
// editor.Text = "Üçüncü sürüm (hatalı)";
//
// editor.Restore(history.Pop());
// Console.WriteLine(editor.Text); // İkinci sürüm
//
// editor.Restore(history.Pop());
// Console.WriteLine(editor.Text); // Birinci sürüm`,
    explanation: [
      "EditorMemento: Editörün belirli andaki durumunu tutar. Alanı yalnızca okunabilir olduğu için sonradan değiştirilemez.",
      "Editor (Originator): Save() ile kendi durumundan bir anı üretir, Restore() ile anıdan durumunu geri yükler.",
      "History (Caretaker): Anıları bir yığında tutar. İçeriklerini yorumlamaz, sadece saklar ve geri verir.",
      "Kullanım örneğinde her önemli noktada Save yapılır. Hata olduğunda Pop ile son güvenli duruma dönülür."
    ],
    pros: ["Nesnenin kapsüllemesini bozmadan durum kaydedebilirsiniz.", "Durum kaydetme ve geri yükleme mantığı ayrı sınıflarda toplanır."],
    cons: ["Çok sayıda ve büyük anı saklamak bellek tüketir.", "Geçmiş yönetimi (ne zaman silinecek?) ekstra sorumluluk getirir."],
    related: ["Command", "Iterator", "Prototype"],
    uml: "[ Caretaker ] ---> [ Memento ] <--- [ Originator | + Save() + Restore() ]",
    summary: "Memento, bir nesnenin durumunu dışarıya açmadan kaydedip geri yüklemeyi sağlar. Undo, kaydet/yükle ve checkpoint gibi özelliklerin temelidir."
  },
  {
    id: "observer",
    name: "Observer",
    category: "Behavioral",
    description: "Bir nesnedeki değişiklik olduğunda, ona abone olan tüm nesnelere otomatik olarak bildirim gönderen davranışsal kalıptır.",
    problem: "Bir haber sitesinde yeni bir haber yayımlandığında mobil uygulama, e-posta servisi ve web sitesi bilgilendirilmelidir. Yayıncı hepsini tek tek çağırırsa her yeni kanalda yayıncının kodu değişmek zorunda kalır.",
    whenToUse: "Bir nesnenin değişmesi başka nesneleri de etkiliyorsa ve bu nesnelerin sayısını önceden bilmiyorsanız veya abonelikleri çalışma zamanında yönetmek istiyorsanız kullanılır.",
    whenNotToUse: "Yalnızca bir iki sabit nesneyi bilgilendirecekseniz doğrudan çağrı daha basittir. Aboneler çok fazlaysa bildirim zinciri takip edilmesi zor hatalara yol açabilir.",
    realWorld: "YouTube kanalına abone olmak. Kanal yeni video yüklediğinde bildirim alırsınız. Kanal sahibi kimlerin abone olduğunu tek tek bilmek zorunda değildir.",
    code: `public interface ISubscriber
{
    void Update(string news);
}

// Subject (yayıncı)
public class NewsPublisher
{
    private readonly List<ISubscriber> _subscribers = new List<ISubscriber>();

    public void Subscribe(ISubscriber subscriber) => _subscribers.Add(subscriber);
    public void Unsubscribe(ISubscriber subscriber) => _subscribers.Remove(subscriber);

    public void Publish(string news)
    {
        Console.WriteLine($"Yeni haber: {news}");
        foreach (var subscriber in _subscribers)
            subscriber.Update(news);
    }
}

public class MobileApp : ISubscriber
{
    public void Update(string news) => Console.WriteLine($"  [Mobil] Bildirim: {news}");
}

public class EmailService : ISubscriber
{
    public void Update(string news) => Console.WriteLine($"  [E-posta] Gönderildi: {news}");
}

// Kullanımı:
// var publisher = new NewsPublisher();
// var mobile = new MobileApp();
// var email = new EmailService();
//
// publisher.Subscribe(mobile);
// publisher.Subscribe(email);
// publisher.Publish("Kalıp Atölyesi yayında!");
//
// publisher.Unsubscribe(email);
// publisher.Publish("Yeni pattern sayfaları eklendi."); // Sadece mobil alır`,
    explanation: [
      "ISubscriber: Abone olmak isteyen tüm sınıfların uygulaması gereken arayüzdür.",
      "NewsPublisher: Abone listesini tutar. Publish çağrıldığında listedeki herkesin Update metodunu çağırır.",
      "MobileApp ve EmailService: Bağımsız aboneler olarak yayıncıdan haberdar olur. Yayıncı onların ne yaptığını bilmez.",
      "Unsubscribe sonrası e-posta servisi artık bildirim almaz. C#'ta aynı fikri event ve delegate ile de kurabilirsiniz."
    ],
    pros: ["Yayıncı ile abone arasındaki bağ gevşek kalır.", "Yeni aboneler yayıncı kodunu değiştirmeden eklenir (Open/Closed).", "Abonelikler çalışma zamanında yönetilebilir."],
    cons: ["Abonelere bildirim sırası garanti edilmez.", "Aboneler listeden çıkarılmayı unutulursa bellek sızıntısı olabilir."],
    related: ["Mediator", "Chain of Responsibility", "Command"],
    uml: "[ Subject (has Observers) ] ---> [ IObserver | + Update() ] <|-- [ ConcreteObserverA, B ]",
    summary: "Observer, bir olay gerçekleştiğinde ilgili tüm nesneleri otomatik bilgilendirir. Olay tabanlı sistemlerin ve arayüz programlamanın temel yapı taşıdır."
  },
  {
    id: "state",
    name: "State",
    category: "Behavioral",
    description: "Bir nesnenin iç durumu değiştiğinde davranışını da değiştirmesini sağlayan, sanki sınıfı değişmiş gibi görünmesine olanak tanıyan davranışsal kalıptır.",
    problem: "Bir siparişin durumları: Yeni, Ödendi, Kargolandı. 'Öde' işlemi yalnızca yeni siparişte, 'Kargola' ise yalnızca ödenmiş siparişte çalışmalıdır. Bunu tek sınıfta switch bloklarıyla yönetirseniz her yeni durum tüm metotları değiştirmenizi gerektirir.",
    whenToUse: "Bir nesnenin davranışı içinde bulunduğu duruma göre değişiyorsa ve çok sayıda durum kontrolü (if/switch) varsa kullanılır.",
    whenNotToUse: "Az sayıda durum varsa ve durumlar nadiren değişiyorsa basit bir enum ve switch yeterlidir, State kalıbı gereksiz olur.",
    realWorld: "Akıllı telefonun güç düğmesi. Ekran kapalıyken düğmeye basmak ekranı açar, açıkken ise kapatır. Aynı düğme telefonun durumuna göre farklı davranır.",
    code: `public interface IOrderState
{
    void Pay(Order order);
    void Ship(Order order);
}

public class Order
{
    public IOrderState State { get; set; } = new NewState();

    public void Pay() => State.Pay(this);
    public void Ship() => State.Ship(this);
}

public class NewState : IOrderState
{
    public void Pay(Order order)
    {
        Console.WriteLine("Ödeme alındı.");
        order.State = new PaidState();
    }

    public void Ship(Order order) =>
        Console.WriteLine("Hata: Ödenmemiş sipariş kargolanamaz.");
}

public class PaidState : IOrderState
{
    public void Pay(Order order) =>
        Console.WriteLine("Sipariş zaten ödenmiş.");

    public void Ship(Order order)
    {
        Console.WriteLine("Sipariş kargoya verildi.");
        order.State = new ShippedState();
    }
}

public class ShippedState : IOrderState
{
    public void Pay(Order order) =>
        Console.WriteLine("Sipariş zaten tamamlandı.");

    public void Ship(Order order) =>
        Console.WriteLine("Sipariş zaten kargoda.");
}

// Kullanımı:
// var order = new Order();
// order.Ship(); // Hata: Ödenmemiş sipariş kargolanamaz.
// order.Pay();  // Ödeme alındı.
// order.Ship(); // Sipariş kargoya verildi.
// order.Ship(); // Sipariş zaten kargoda.`,
    explanation: [
      "IOrderState: Her durumun ortak arayüzüdür. Siparişin yapabileceği işlemler burada tanımlıdır.",
      "Order: Mevcut durumu (State) tutar ve her işlemi bu nesneye devreder. Kendisi hiçbir if/switch içermez.",
      "NewState, PaidState, ShippedState: Aynı işlemin o durumdaki davranışını tanımlar. Uygun olduğunda order.State değerini değiştirerek durum geçişini yapar.",
      "Yeni bir durum (örneğin İptal Edildi) eklemek için yeni bir sınıf yazmak yeterlidir."
    ],
    pros: ["Duruma bağlı davranışlar ayrı sınıflarda toplanır (Single Responsibility).", "Yeni durumlar mevcut sınıfları değiştirmeden eklenir (Open/Closed).", "Büyük if/switch bloklarından kurtarır."],
    cons: ["Az sayıda durumu olan basit yapılar için aşırı mühendislik olabilir.", "Durum sayısı arttıkça sınıf sayısı da artar."],
    related: ["Strategy", "Bridge", "Command"],
    uml: "[ Context (has State) ] ---> [ IState ] <|-- [ ConcreteStateA, B, C ]  (durumlar birbirine geçiş yapabilir)",
    summary: "State, bir nesnenin duruma göre değişen davranışlarını ayrı sınıflara böler. Karmaşık durum kontrollerinden kurtulmak ve geçiş kurallarını düzenlemek için idealdir."
  },
  {
    id: "template-method",
    name: "Template Method",
    category: "Behavioral",
    description: "Bir algoritmanın iskeletini üst sınıfta tanımlayıp, bazı adımların ayrıntısını alt sınıflara bırakan davranışsal kalıptır.",
    problem: "PDF ve Excel raporu üretirken adımlar aynıdır: veriyi topla, biçimlendir, dışa aktar. Ancak biçimlendirme ve dışa aktarma her formatta farklıdır. Ortak akışı her sınıfta tekrar yazarsanız kod çoğalır.",
    whenToUse: "Birkaç sınıf neredeyse aynı adımları izliyor ama bazı adımlar farklıysa veya algoritmanın genel akışını sabit tutup yalnızca belirli adımların değişmesine izin vermek istiyorsanız kullanılır.",
    whenNotToUse: "Sınıflar arasında ortak bir akış yoksa veya alt sınıfların akışın sırasını değiştirmesi gerekiyorsa uygun değildir. Kalıtıma dayandığı için esnekliği sınırlıdır.",
    realWorld: "Bir yemek tarifi. Malzemeleri hazırla, pişir, servis et. Adımların sırası aynıdır ama 'pişir' adımı makarnada haşlamak, tavukta fırınlamak olabilir.",
    code: `public abstract class ReportGenerator
{
    // Template method: algoritmanın iskeleti. Alt sınıflar sırayı değiştiremez.
    public void Generate()
    {
        CollectData();
        Format();
        Export();
        AddFooter();
    }

    // Ortak adım
    private void CollectData() =>
        Console.WriteLine("Veriler veritabanından toplandı.");

    // Alt sınıfların doldurması gereken adımlar
    protected abstract void Format();
    protected abstract void Export();

    // Hook: isteğe bağlı, varsayılanı boş
    protected virtual void AddFooter() { }
}

public class PdfReport : ReportGenerator
{
    protected override void Format() => Console.WriteLine("PDF düzenine göre biçimlendirildi.");
    protected override void Export() => Console.WriteLine("report.pdf dosyası oluşturuldu.");
    protected override void AddFooter() => Console.WriteLine("Sayfa numaraları eklendi.");
}

public class ExcelReport : ReportGenerator
{
    protected override void Format() => Console.WriteLine("Tablo hücrelerine yerleştirildi.");
    protected override void Export() => Console.WriteLine("report.xlsx dosyası oluşturuldu.");
}

// Kullanımı:
// new PdfReport().Generate();
// Console.WriteLine("---");
// new ExcelReport().Generate();`,
    explanation: [
      "Generate(): Şablon metottur. Adımların sırasını belirler ve alt sınıflar bu sırayı değiştiremez.",
      "CollectData: Ortak adımdır. Her rapor için aynıdır ve üst sınıfta yalnızca bir kez yazılmıştır.",
      "Format ve Export: Soyut adımlardır. Her rapor türü kendi biçimine göre doldurur.",
      "AddFooter: Bir 'hook' metodudur. Varsayılan olarak boştur, isteyen alt sınıf üzerine yazar (PdfReport gibi), istemeyen yazmaz (ExcelReport gibi)."
    ],
    pros: ["Kod tekrarını azaltır, ortak akış tek yerde durur.", "Algoritmanın yalnızca belirli kısımlarını değiştirilebilir yapar.", "Akışın sırası korunur, alt sınıflar yanlışlıkla bozamaz."],
    cons: ["Kalıtıma dayandığı için esnekliği sınırlıdır.", "Adım sayısı arttıkça alt sınıfların hangi adımı yapması gerektiğini takip etmek zorlaşır."],
    related: ["Factory Method", "Strategy"],
    uml: "[ AbstractClass | + TemplateMethod() # Step1() # Step2() ] <|-- [ ConcreteClassA, B ]",
    summary: "Template Method, algoritmanın iskeletini üst sınıfta sabitler ve değişen adımları alt sınıflara bırakır. Benzer akışlara sahip sınıflardaki kod tekrarını önler."
  },
  {
    id: "visitor",
    name: "Visitor",
    category: "Behavioral",
    description: "Yeni işlemleri, üzerinde çalıştıkları sınıfları değiştirmeden ekleyebilmenizi sağlayan davranışsal kalıptır.",
    problem: "Daire ve dikdörtgen gibi şekilleriniz var. Bugün alan hesabı, yarın açıklama üretme, sonra çizim gibi işlemler isteniyor. Her seferinde şekil sınıflarına yeni metot eklemek, onları alakasız sorumluluklarla doldurur.",
    whenToUse: "Karmaşık bir nesne yapısı üzerinde nesne türlerine göre değişen işlemler yapmanız gerekiyorsa ve nesne sınıflarını değiştirmeden yeni işlemler eklemek istiyorsanız kullanılır.",
    whenNotToUse: "Nesne türleri sık sık değişiyorsa uygun değildir. Yeni bir nesne türü eklendiğinde tüm ziyaretçilerin güncellenmesi gerekir.",
    realWorld: "Bir sigorta eksperi. Farklı türde evlere (apartman, villa, ofis) gider ve her birine uygun yöntemle değerlendirme yapar. Evler değişmez, eksper yeni bir uzmanlık eklediğinde evlerin değişmesi gerekmez.",
    code: `public interface IShapeVisitor
{
    void Visit(Circle circle);
    void Visit(Rectangle rectangle);
}

public interface IShape
{
    void Accept(IShapeVisitor visitor);
}

public class Circle : IShape
{
    public double Radius { get; }

    public Circle(double radius)
    {
        Radius = radius;
    }

    public void Accept(IShapeVisitor visitor) => visitor.Visit(this);
}

public class Rectangle : IShape
{
    public double Width { get; }
    public double Height { get; }

    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
    }

    public void Accept(IShapeVisitor visitor) => visitor.Visit(this);
}

// Yeni işlem 1: alan hesabı
public class AreaVisitor : IShapeVisitor
{
    public void Visit(Circle circle) =>
        Console.WriteLine($"Daire alanı: {Math.PI * circle.Radius * circle.Radius:F2}");

    public void Visit(Rectangle rectangle) =>
        Console.WriteLine($"Dikdörtgen alanı: {rectangle.Width * rectangle.Height:F2}");
}

// Yeni işlem 2: açıklama üretme (şekil sınıfları değişmedi)
public class DescribeVisitor : IShapeVisitor
{
    public void Visit(Circle circle) =>
        Console.WriteLine($"Daire, yarıçap = {circle.Radius}");

    public void Visit(Rectangle rectangle) =>
        Console.WriteLine($"Dikdörtgen, {rectangle.Width} x {rectangle.Height}");
}

// Kullanımı:
// IShape[] shapes = { new Circle(2), new Rectangle(3, 4) };
// var area = new AreaVisitor();
// var describe = new DescribeVisitor();
//
// foreach (var shape in shapes)
// {
//     shape.Accept(area);
//     shape.Accept(describe);
// }`,
    explanation: [
      "IShape.Accept: Her şeklin bir ziyaretçiyi kabul etmesini sağlar. Şekil kendini ziyaretçiye Visit(this) ile tanıtır.",
      "IShapeVisitor: Her şekil türü için ayrı bir Visit metodu tanımlar. Derleyici doğru metodu otomatik seçer.",
      "AreaVisitor ve DescribeVisitor: İki farklı işlemi temsil eder. Şekil sınıflarına hiç dokunmadan eklendiler.",
      "Bu tasarımın bedeli: yeni bir şekil türü (örneğin Üçgen) eklemek, tüm ziyaretçileri değiştirmeyi gerektirir."
    ],
    pros: ["Yeni işlemleri nesne sınıflarını değiştirmeden ekleyebilirsiniz (Open/Closed).", "İlgili işlem tek bir sınıfta toplanır.", "Farklı türlerdeki nesneler üzerinde tür bilgisine göre işlem yapmak temiz hale gelir."],
    cons: ["Yeni bir nesne türü eklendiğinde tüm ziyaretçilerin güncellenmesi gerekir.", "Başlangıç seviyesi için anlaşılması zor bir kalıptır."],
    related: ["Composite", "Iterator", "Command"],
    uml: "[ IElement | + Accept(visitor) ] <|-- [ ConcreteElementA, B ]   ---->   [ IVisitor | + Visit(A) + Visit(B) ] <|-- [ ConcreteVisitor ]",
    summary: "Visitor, nesne yapısını değiştirmeden ona yeni işlemler eklemenizi sağlar. İşlemler sık değişip nesne türleri az değişiyorsa çok uygundur, tersi durumda zorlayıcı olur."
  }
];