// products.js
const allProducts = [
    {
        id: 1,
        name: "Men's Running T-Shirt",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.northernrunner.com%2Fimages%2Ftech-marathon-mens-short-sleeved-breathable-running-t-shirt-black-azurite-p6346-25007_image.jpg&f=1&nofb=1&ipt=918fe9c0385a33d0096a2fd06c8138197346b8e283a34f282d2460bafedb261e",
        price: 29.99,
        category: "Clothing",
        brand: "Nike",
        rating: 4.5,
        tags: ["New", "Breathable"],
        description: "Lightweight and breathable running t-shirt for men.",
        addedDate: "2023-10-01T10:00:00Z"
    },
    {
        id: 2,
        name: "Women's Yoga Pants",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.kwcdn.com%2Fproduct%2FFancyalgo%2FVirtualModelMatting%2Ffbdb7353012fb506675c604c5f05b93c.jpg%3FimageView2%2F2%2Fw%2F800%2Fq%2F70%2Fformat%2Fwebp&f=1&nofb=1&ipt=ef43432d9a563e52e53055e0c4e771dc21267b03629366e86b320b2003d79cb4",
        price: 45.50,
        category: "Clothing",
        brand: "Lululemon",
        rating: 4.8,
        tags: ["Comfort Fit"],
        description: "Stretchable and comfortable yoga pants for women.",
        addedDate: "2023-09-15T14:30:00Z"
    },
    {
        id: 3,
        name: "Basketball Pro Model",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fm.media-amazon.com%2Fimages%2FI%2F813L-g8-GZL._AC_UL1500_.jpg&f=1&nofb=1&ipt=e0577d145f086fe8246e1b2d166852535e2ed2e8a89253377160d07bfb534fbe",
        price: 25.00,
        category: "Equipment",
        brand: "Spalding",
        rating: 4.2,
        tags: ["Indoor/Outdoor"],
        description: "Official size and weight basketball.",
        addedDate: "2023-11-01T09:00:00Z"
    },
    {
        id: 4,
        name: "Football Team Kit",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.prodirectsport.com%2FProductImages%2FMain%2F266127_Main_Thumb_1191045.jpg&f=1&nofb=1&ipt=6237ea3f8c11bf62463a236f430c6527dac5c02d0ae9ea33be26ebfe68dcb86b",
        price: 89.99,
        category: "Kits",
        brand: "Adidas",
        rating: 4.6,
        tags: ["Full Set", "Sale"],
        description: "Complete football kit including jersey and shorts.",
        addedDate: "2023-08-20T11:00:00Z"
    },
    {
        id: 5,
        name: "Tennis Racket - Advanced",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcontents.mediadecathlon.com%2Fp1785089%2Fk%24a59ad28c46e5c8562c5094f2d927e278%2Fsq%2FAdult%2BTennis%2BRacket%2BTR500%2BGreen.jpg&f=1&nofb=1&ipt=76f375aa8bd69494b16c2df0fb756f0b1182ae182f6355f8217994763d0a5afb",
        price: 120.00,
        category: "Equipment",
        brand: "Wilson",
        rating: 4.9,
        tags: ["Pro Level"],
        description: "High-performance tennis racket for advanced players.",
        addedDate: "2023-10-25T16:20:00Z"
    },
    {
        id: 6,
        name: "Cycling Helmet",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi5.walmartimages.com%2Fasr%2F5733415a-70b8-490d-8090-561a1ac85045_1.08c10b4ae93ace8bbabec5e9d6f16e28.jpeg&f=1&nofb=1&ipt=fb80e63b3590b63487247195dcbab7258cddb1b6785d1f963819511bfa48fe80",
        price: 55.75,
        category: "Equipment",
        brand: "Giro",
        rating: 4.3,
        tags: ["Safety First"],
        description: "Aerodynamic and safe cycling helmet.",
        addedDate: "2023-07-10T08:15:00Z"
    },
    {
        id: 7,
        name: "Swimming Goggles",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fswimming-google-white-background-58978951.jpg&f=1&nofb=1&ipt=b549dacfcf129f2dcbc0e88c3ff6777945ed71d3dfb0c51f6d1baa5006b6c4dc",
        price: 15.99,
        category: "Equipment",
        brand: "Speedo",
        rating: 4.0,
        tags: ["Anti-Fog"],
        description: "Comfortable swimming goggles with anti-fog coating.",
        addedDate: "2023-11-05T13:00:00Z"
    },
    {
        id: 8,
        name: "Running Shoes - Neutral",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fworthly.com%2Fwp-content%2Fuploads%2F2014%2F11%2F139517568.jpg&f=1&nofb=1&ipt=211af65a6436162a07b1f77920364a6560c9f4e251eb056ea1f715a3411b6bfb",
        price: 99.99,
        category: "Clothing",
        brand: "Asics",
        rating: 4.7,
        tags: ["Cushioned", "Sale"],
        description: "Neutral running shoes for daily training.",
        addedDate: "2023-06-01T12:00:00Z"
    },
    {
        id: 9,
        name: "Home Gym Dumbbell Set",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi5.walmartimages.com%2Fseo%2FFitRx-SmartBell-Quick-Select-Adjustable-Dumbbell-for-Home-Gym-5-52-5-lbs-Weight-Black-Single_68745ffa-afdb-493a-a49f-ca3b857514d6.777753729e5cf337177c130648e9a631.jpeg&f=1&nofb=1&ipt=d2e9e76dd3037647c5eaf583609f1fab569829c804dac500ba5147fcab0217c5",
        price: 150.00,
        category: "Equipment",
        brand: "Bowflex",
        rating: 4.4,
        tags: ["Adjustable"],
        description: "Adjustable dumbbell set for home workouts.",
        addedDate: "2023-09-05T18:00:00Z"
    },
    {
        id: 10,
        name: "Soccer Ball - Training",
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Ffootball%2Ffootball_PNG28463.png&f=1&nofb=1&ipt=1cb9f50cbda3fd3476383efb6366fa8309019507405ec77a0ad8cf9ad1fd15ea",
        price: 19.99,
        category: "Equipment",
        brand: "Nike",
        rating: 4.1,
        tags: [],
        description: "Durable training soccer ball.",
        addedDate: "2023-10-10T10:10:00Z"
    }
    // Add more products as needed
];

// Create dummy images if you don't have them.
// For real projects, use actual image paths.
// Create an `images` folder and put some placeholder images like:
// running_shirt.jpg, yoga_pants.jpg, basketball.jpg, etc.
// You can use a service like placeholder.com (e.g., https://via.placeholder.com/300x200.png?text=Product+Image)
allProducts.forEach(p => {
    if (!p.image || p.image.startsWith("images/")) { // simple check
        const imageName = p.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '') + ".jpg";
        p.image = `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(p.name)}`;
        // To make it look more like a real path if you create dummy files:
        // p.image = `images/${imageName}`;
    }
});