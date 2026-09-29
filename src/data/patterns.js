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
  }
];