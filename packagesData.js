// Love My Tour - Tour Packages & Destinations Comprehensive Dataset

export const destinationsData = {
  // --- DOMESTIC PACKAGES ---
  "andaman": {
    id: "andaman",
    title: "Andaman Packages",
    category: "Domestic",
    banner: "assets/packages-images/Andaman.jpg",
    description: "Explore crystal clear turquoise waters, pristine coral reefs, white sand beaches, and historic cellular jail tours in Andaman & Nicobar Islands.",
    packages: [
      {
        id: "fascinating-andaman",
        title: "Fascinating Andaman Tour Package",
        duration: "6 Days / 5 Nights",
        price: "₹10,000",
        priceNum: 10000,
        perPerson: true,
        tag: "Best Seller",
        image: "assets/packages-images/Andaman.jpg",
        rating: "4.9",
        reviewsCount: 142,
        highlights: ["Corbyn's Cove Beach", "Cellular Jail Light & Sound Show", "Havelock Island Cruise", "Radhanagar Beach Sunset", "Elephant Beach Snorkeling"],
        hotel: "3★ / 4★ Beach Resorts with Sea View",
        inclusions: [
          "5 Nights Accommodation in Handpicked Beach Resorts",
          "Daily Breakfast & Special Candlelight Dinner",
          "Inter-island Private Cruise Tickets (Makruzz / Nautika)",
          "All transfers in Private AC Sedan/SUV with Chauffeur",
          "Snorkeling Session at Elephant Beach with Certified Guide",
          "Entry permits & Cellular Jail Entrance passes"
        ],
        exclusions: [
          "Airfare / Train tickets to Port Blair",
          "Personal expenses like laundry, room service",
          "Water sports beyond mentioned itinerary"
        ],
        itinerary: [
          { day: "Day 1", title: "Arrival at Port Blair & Cellular Jail", desc: "Welcome at Veer Savarkar International Airport. Transfer to hotel. Afternoon visit to Corbyn's Cove Beach, followed by the light & sound show at Cellular Jail." },
          { day: "Day 2", title: "Port Blair to Havelock Island (Radhanagar Beach)", desc: "Board high-speed private catamaran to Havelock Island. Check-in at beach resort. Spend evening at Asia's famous Radhanagar Beach (Beach No. 7)." },
          { day: "Day 3", title: "Elephant Beach & Snorkeling Excursion", desc: "Speedboat ride to Elephant Beach for complimentary snorkeling experience. Discover vibrant coral reefs and marine life with guide." },
          { day: "Day 4", title: "Havelock to Neil Island (Natural Bridge & Laxmanpur)", desc: "Cruise to Neil Island. Visit Howrah Bridge (Natural Rock Bridge), Bharatpur Beach, and enjoy sunset at Laxmanpur Beach." },
          { day: "Day 5", title: "Neil Island back to Port Blair & Shopping", desc: "Morning leisure, then cruise back to Port Blair. Evening local handicraft & sea shell shopping at Sagarika Emporium." },
          { day: "Day 6", title: "Departure from Port Blair", desc: "Breakfast at hotel and private transfer to airport for return journey home." }
        ]
      },
      {
        id: "amazing-andaman-vacation",
        title: "Amazing Andaman Vacation",
        duration: "5 Days / 4 Nights",
        price: "₹5,690",
        priceNum: 5690,
        perPerson: true,
        tag: "Budget Friendly",
        image: "assets/packages-images/Andaman.jpg",
        rating: "4.8",
        reviewsCount: 98,
        highlights: ["Port Blair Sightseeing", "Havelock Island", "Radhanagar Sunset", "Ross Island Ruins"],
        hotel: "3★ Comfortable City & Beach Stays",
        inclusions: [
          "4 Nights Hotel Stay",
          "Daily Breakfast",
          "Island Ferry Transfers",
          "AC Transport for Sightseeing",
          "Driver charges & toll taxes"
        ],
        exclusions: ["Flight tickets", "Lunch & Dinner", "Water sports activities"],
        itinerary: [
          { day: "Day 1", title: "Arrival Port Blair & Local Tour", desc: "Pick up from airport, check-in and visit Corbyn's Cove Beach and Cellular Jail." },
          { day: "Day 2", title: "Transfer to Havelock Island", desc: "Early morning ferry to Havelock. Evening relaxed at Radhanagar Beach." },
          { day: "Day 3", title: "Kalapathar Beach & Havelock Exploration", desc: "Visit serene Kalapathar Beach with turquoise waters and scenic photo spots." },
          { day: "Day 4", title: "Ross Island & North Bay Excursion", desc: "Ferry ride to Ross Island (British colonial ruins) and North Bay coral island." },
          { day: "Day 5", title: "Airport Departure", desc: "Check out and drop off at Port Blair Airport." }
        ]
      },
      {
        id: "enthralling-andaman-holidays",
        title: "Enthralling Andaman Holidays Package",
        duration: "5 Days / 4 Nights",
        price: "₹5,690",
        priceNum: 5690,
        perPerson: true,
        tag: "Popular Choice",
        image: "assets/packages-images/Andaman.jpg",
        rating: "4.8",
        reviewsCount: 110,
        highlights: ["Chidiya Tapu Sunset", "Havelock Island", "Beach Resort Stay", "Museum Visit"],
        hotel: "3★ Deluxe Hotels & Beach Cabanas",
        inclusions: ["4 Nights Accommodation", "Breakfast", "Ferry Passes", "Sightseeing Cab"],
        exclusions: ["Personal Expenses", "Airfare"],
        itinerary: [
          { day: "Day 1", title: "Arrival Port Blair & Chidiya Tapu", desc: "Transfer to hotel, visit Anthropological Museum & Chidiya Tapu for breathtaking sunset." },
          { day: "Day 2", title: "Havelock Island Departure", desc: "Ferry to Havelock, stay at beach resort." },
          { day: "Day 3", title: "Radhanagar & Elephant Beach", desc: "Full day beach hopping and leisure." },
          { day: "Day 4", title: "Return Port Blair", desc: "Shopping tour in Port Blair city." },
          { day: "Day 5", title: "Airport Transfer", desc: "Departure with pleasant memories." }
        ]
      },
      {
        id: "affordable-andaman-tours",
        title: "Affordable Andaman Tours",
        duration: "4 Days / 3 Nights",
        price: "₹5,500",
        priceNum: 5500,
        perPerson: true,
        tag: "Quick Escape",
        image: "assets/packages-images/Andaman.jpg",
        rating: "4.7",
        reviewsCount: 76,
        highlights: ["Port Blair Highlights", "Havelock Day Trip", "Cellular Jail"],
        hotel: "3★ Standard Hotels",
        inclusions: ["3 Nights Hotel Stay", "Breakfast", "Ferry Tickets", "Airport Pick/Drop"],
        exclusions: ["Flights", "Water sports", "Lunch/Dinner"],
        itinerary: [
          { day: "Day 1", title: "Port Blair Arrival", desc: "Airport pick up, check-in and visit Cellular Jail." },
          { day: "Day 2", title: "Havelock Island Excursion", desc: "Day tour to Havelock and Radhanagar Beach." },
          { day: "Day 3", title: "Ross Island & Shopping", desc: "Historical tour and local market exploration." },
          { day: "Day 4", title: "Departure", desc: "Transfer to airport for return flight." }
        ]
      }
    ]
  },

  "goa": {
    id: "goa",
    title: "Goa Packages",
    category: "Domestic",
    banner: "assets/packages-images/goa.png",
    description: "Sun, sand, spices, and nightlife! Enjoy Goa's golden beaches, water sports, Portuguese heritage churches, and sunset cruises.",
    packages: [
      {
        id: "exotic-goan-beach",
        title: "Holidays in Exotic Goan Beach",
        duration: "4 Days / 3 Nights",
        price: "₹4,500",
        priceNum: 4500,
        perPerson: true,
        tag: "Beach Party",
        image: "assets/packages-images/goa.png",
        rating: "4.9",
        reviewsCount: 215,
        highlights: ["Baga Beach Nightlife", "Calangute Beach Watersports", "Mandovi River Sunset Cruise", "Old Goa Churches"],
        hotel: "4★ Resort with Swimming Pool & Beach Access",
        inclusions: [
          "3 Nights stay in luxury 4-star beach resort",
          "Daily buffet breakfast & welcome drink",
          "Mandovi River Sunset Cruise ticket",
          "Full day North Goa sightseeing tour by private cab",
          "Full day South Goa sightseeing tour",
          "Airport / Thivim railway station pick-up & drop"
        ],
        exclusions: ["Flight / Train tickets", "Water sports charges", "Alcoholic beverages"],
        itinerary: [
          { day: "Day 1", title: "Welcome to Goa & Evening Cruise", desc: "Arrival at Goa airport/station. Check in at resort. Relax by pool. Evening 1-hour Mandovi river cruise with live Goan folk dance." },
          { day: "Day 2", title: "North Goa Beaches & Nightlife", desc: "Visit Calangute Beach, Baga Beach, Anjuna Beach, and Fort Aguada. Evening party at Tito's Lane." },
          { day: "Day 3", title: "South Goa Heritage & Spice Plantation", desc: "Visit Basilica of Bom Jesus, Se Cathedral, Mangueshi Temple, and Sahakari Spice Farm with traditional buffet lunch." },
          { day: "Day 4", title: "Departure from Goa", desc: "Leisure morning at beach, check-out and drop off at airport/station." }
        ]
      },
      {
        id: "magnificent-goa-holiday",
        title: "Magnificent Goa Holiday Package",
        duration: "3 Days / 2 Nights",
        price: "₹4,000",
        priceNum: 4000,
        perPerson: true,
        tag: "Weekend Getaway",
        image: "assets/packages-images/goa.png",
        rating: "4.8",
        reviewsCount: 84,
        highlights: ["Calangute Beach", "Fort Aguada", "Panjim Market"],
        hotel: "3★ Beachfront Hotel",
        inclusions: ["2 Nights Hotel Stay", "Breakfast", "Sightseeing Cab", "Station Transfers"],
        exclusions: ["Meals outside breakfast", "Personal sports activities"],
        itinerary: [
          { day: "Day 1", title: "Arrival & Beach Evening", desc: "Transfer to hotel, check-in and evening walk at Calangute Beach." },
          { day: "Day 2", title: "Goa Sightseeing Tour", desc: "Explore Aguada Fort, Miramar Beach, Panjim City shopping." },
          { day: "Day 3", title: "Departure", desc: "Check out and drop to airport or railway station." }
        ]
      }
    ]
  },

  "kerala": {
    id: "kerala",
    title: "Kerala Packages",
    category: "Domestic",
    banner: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
    description: "God's Own Country! Experience rolling tea gardens in Munnar, tranquil backwater houseboats in Alleppey, and sun-kissed Kovalam beaches.",
    packages: [
      {
        id: "romantic-kerala-backwaters",
        title: "Romantic Kerala Backwaters & Hills",
        duration: "5 Days / 4 Nights",
        price: "₹5,990",
        priceNum: 5990,
        perPerson: true,
        tag: "Honeymoon Special",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 189,
        highlights: ["Private Deluxe Houseboat", "Munnar Tea Gardens", "Cheeyappara Waterfalls", "Spice Plantation Tour", "Kathakali Cultural Show"],
        hotel: "4★ Hill Resort in Munnar + 1 Night Deluxe Houseboat Stay",
        inclusions: [
          "2 Nights in Munnar Hill Resort + 1 Night Houseboat Stay in Alleppey + 1 Night Cochin Hotel",
          "All meals on Houseboat (Breakfast, Lunch, Evening Tea & Candlelight Dinner)",
          "Daily Breakfast at Hotels",
          "Private AC Sedan for entire tour (Cochin to Cochin)",
          "Tea Garden entrance passes & Kathakali show ticket",
          "Driver allowance, toll, fuel & parking fees"
        ],
        exclusions: ["Airfare / Train fare", "Personal tips & extra room service"],
        itinerary: [
          { day: "Day 1", title: "Arrival Cochin to Munnar (Hill Station)", desc: "Greeting at Cochin Airport/Station. Scenic drive to Munnar passing Cheeyappara & Valara Waterfalls. Check in at hill resort." },
          { day: "Day 2", title: "Munnar Tea Estates & Mattupetty Dam", desc: "Visit Eravikulam National Park (Nilgiri Tahr), Tea Museum, Mattupetty Dam, Echo Point, and Kundala Lake." },
          { day: "Day 3", title: "Munnar to Alleppey Houseboat Cruise", desc: "Drive down to Alleppey. Board private deluxe Houseboat at 12:00 PM. Cruise through lush palm-fringed backwater canals with fresh Keralite lunch." },
          { day: "Day 4", title: "Alleppey to Cochin Sightseeing", desc: "Check out from houseboat, drive to Cochin. Visit Fort Kochi Chinese Fishing Nets, St. Francis Church, Mattancherry Palace." },
          { day: "Day 5", title: "Departure Cochin", desc: "Breakfast, souvenir shopping at Lulu Mall, and transfer to airport." }
        ]
      },
      {
        id: "marvellous-munnar",
        title: "Marvellous Munnar Hills",
        duration: "4 Days / 3 Nights",
        price: "₹4,800",
        priceNum: 4800,
        perPerson: true,
        tag: "Nature & Mist",
        image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85",
        rating: "4.8",
        reviewsCount: 92,
        highlights: ["Munnar Hills", "Tea Gardens", "Rose Garden", "Elephant Safari"],
        hotel: "3★ Tea Garden Resort",
        inclusions: ["3 Nights Accommodation", "Breakfast", "Private Cab", "Sightseeing Passes"],
        exclusions: ["Airfare", "Personal expenses"],
        itinerary: [
          { day: "Day 1", title: "Cochin to Munnar Drive", desc: "Scenic mountain drive and waterfall views." },
          { day: "Day 2", title: "Munnar Exploration", desc: "Tea estate tour, Eravikulam park, Echo Point." },
          { day: "Day 3", title: "Spice Plantation & Lake Tour", desc: "Elephant park visit and spice garden tour." },
          { day: "Day 4", title: "Return Cochin", desc: "Drop off at Cochin airport/station." }
        ]
      },
      {
        id: "captivating-kovalam-kanyakumari",
        title: "Captivating Kovalam & Kanyakumari",
        duration: "4 Days / 3 Nights",
        price: "₹5,200",
        priceNum: 5200,
        perPerson: true,
        tag: "Coastal Beauty",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
        rating: "4.7",
        reviewsCount: 65,
        highlights: ["Kovalam Lighthouse Beach", "Vivekananda Rock Memorial", "Trivandrum Temple"],
        hotel: "3★ Beachfront Resort",
        inclusions: ["3 Nights Hotel Stay", "Breakfast", "Private Cab", "Ferry Tickets"],
        exclusions: ["Airfare", "Lunch/Dinner"],
        itinerary: [
          { day: "Day 1", title: "Trivandrum to Kovalam", desc: "Pick up and transfer to Kovalam beach resort." },
          { day: "Day 2", title: "Kanyakumari Excursion", desc: "Ferry to Vivekananda Rock Memorial, Sunset View Point." },
          { day: "Day 3", title: "Trivandrum City Tour", desc: "Padmanabhaswamy Temple & Napier Museum." },
          { day: "Day 4", title: "Departure", desc: "Drop to Trivandrum airport." }
        ]
      }
    ]
  },

  "himachal": {
    id: "himachal",
    title: "Himachal Packages",
    category: "Domestic",
    banner: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85",
    description: "Snow-capped Himalayan peaks, pine forests, adventure sports in Solang Valley, and scenic hill towns like Shimla, Manali & Dharamshala.",
    packages: [
      {
        id: "enthralling-himachal-manali",
        title: "Enthralling Himachal & Manali",
        duration: "6 Days / 5 Nights",
        price: "₹3,650",
        priceNum: 3650,
        perPerson: true,
        tag: "Best Value",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 310,
        highlights: ["Solang Valley Snow Sports", "Atal Tunnel Tour", "Hadimba Temple Manali", "Mall Road Shimla", "Manikaran Sahib Gurudwara"],
        hotel: "3★ Deluxe Mountain View Hotel in Shimla & Manali",
        inclusions: [
          "2 Nights Stay in Shimla + 3 Nights Stay in Manali",
          "Daily Breakfast & Choice of Dinner",
          "Delhi - Shimla - Manali - Delhi AC Volvo / Private Cab",
          "Full Day Solang Valley & Atal Tunnel Sightseeing",
          "Honeymoon inclusions (Flower bed decoration + Candlelight dinner for couples)",
          "All state taxes, toll & driver charges"
        ],
        exclusions: ["Solang Valley skiing/paragliding activities", "Rohtang Pass permit fees"],
        itinerary: [
          { day: "Day 1", title: "Delhi to Shimla Drive", desc: "Overnight drive / morning transfer from Delhi to Shimla. Check in at hotel, evening walk at Shimla Mall Road & Ridge." },
          { day: "Day 2", title: "Shimla & Kufri Excursion", desc: "Excursion to Kufri snow point, Himalayan Nature Park, Jakhoo Temple, and Green Valley." },
          { day: "Day 3", title: "Shimla to Manali via Kullu Valley", desc: "Scenic drive past Pandoh Dam, Kullu Valley, Sundernagar Lake, and River Rafting point." },
          { day: "Day 4", title: "Manali Local Sightseeing", desc: "Visit Hadimba Devi Temple, Vashisht Hot Springs, Tibetan Monastery, and Club House." },
          { day: "Day 5", title: "Solang Valley & Atal Tunnel", desc: "Full day excursion to Solang Valley for ropeway, paragliding, snow activities and drive through Atal Tunnel." },
          { day: "Day 6", title: "Manali to Delhi Departure", desc: "Breakfast, shopping at Mall Road, and return drive to Delhi." }
        ]
      },
      {
        id: "honeymoon-shimla-manali",
        title: "Honeymoon In Shimla Manali",
        duration: "7 Days / 6 Nights",
        price: "₹5,699",
        priceNum: 5699,
        perPerson: true,
        tag: "Couple Special",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 175,
        highlights: ["Candlelight Dinner", "Flower Decoration", "Kufri", "Solang Valley"],
        hotel: "4★ Luxury Mountain View Suite",
        inclusions: ["6 Nights Stay", "Breakfast & Dinner", "Volvo Transport", "Honeymoon Kit"],
        exclusions: ["Personal sports activities", "Airfare"],
        itinerary: [
          { day: "Day 1", title: "Delhi to Shimla Transfer", desc: "Drive to Shimla, welcome drinks and mountain stay." },
          { day: "Day 2", title: "Kufri & Ridge Exploration", desc: "Horse riding, snow games, romantic evening at Mall Road." },
          { day: "Day 3", title: "Scenic Drive to Manali", desc: "Kullu shawl factory visit, river rafting option." },
          { day: "Day 4", title: "Manali Local Tour", desc: "Hadimba Temple and romantic candlelight dinner." },
          { day: "Day 5", title: "Solang Valley & Snow Point", desc: "Cable car ride and snow sports." },
          { day: "Day 6", title: "Manikaran Hot Springs", desc: "Spiritual tour to Kasol and Manikaran." },
          { day: "Day 7", title: "Return to Delhi", desc: "Departure transfer." }
        ]
      }
    ]
  },

  "kashmir": {
    id: "kashmir",
    title: "Jammu-Kashmir Packages",
    category: "Domestic",
    banner: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85",
    description: "Paradise on Earth! Experience luxury houseboats on Dal Lake, Shikara rides, Gulmarg gondola rides, and saffron valleys in Pahalgam.",
    packages: [
      {
        id: "kashmir-fantasy-getaway",
        title: "Kashmir Fantasy Getaway",
        duration: "5 Days / 4 Nights",
        price: "₹5,669",
        priceNum: 5669,
        perPerson: true,
        tag: "Top Destination",
        image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 240,
        highlights: ["Dal Lake Luxury Houseboat Stay", "Complimentary Shikara Ride", "Gulmarg Gondola Cable Car", "Pahalgam Betaab Valley", "Srinagar Mughal Gardens"],
        hotel: "4★ Hotel in Srinagar & Pahalgam + 1 Night Deluxe Heritage Houseboat",
        inclusions: [
          "3 Nights Hotel Stay + 1 Night Heritage Houseboat Stay on Dal Lake",
          "Daily Breakfast & Chef Special Dinner",
          "1 Hour Shikara Ride on Dal Lake included",
          "Private AC Vehicle (Tavera/Innova) for all airport & inter-city transfers",
          "Excursions to Gulmarg, Pahalgam, and Sonmarg",
          "Driver allowances, toll, fuel & parking"
        ],
        exclusions: ["Gulmarg Gondola Phase 1 & 2 tickets (can be pre-booked)", "Pony rides"],
        itinerary: [
          { day: "Day 1", title: "Arrival Srinagar & Houseboat Check-in", desc: "Pick up at Srinagar Airport. Transfer to luxury Houseboat on Dal Lake. Enjoy 1-hour sunset Shikara ride." },
          { day: "Day 2", title: "Srinagar Mughal Gardens Tour", desc: "Visit Nishat Bagh, Shalimar Bagh, Chashme Shahi, and Shankaracharya Temple." },
          { day: "Day 3", title: "Srinagar to Gulmarg Meadows", desc: "Drive to Gulmarg (Meadow of Flowers). Take the world's highest Gondola cable car ride to Kongdoori & Apharwat peak." },
          { day: "Day 4", title: "Gulmarg to Pahalgam Valley", desc: "Drive to Pahalgam (Valley of Shepherds). Visit Saffron fields, Avantipur Ruins, Betaab Valley & Aru Valley." },
          { day: "Day 5", title: "Departure Srinagar", desc: "Transfer to Srinagar Airport for departure." }
        ]
      },
      {
        id: "magical-kashmir",
        title: "Magical Kashmir Experience",
        duration: "7 Days / 6 Nights",
        price: "₹8,990",
        priceNum: 8990,
        perPerson: true,
        tag: "Grand Tour",
        image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 162,
        highlights: ["Srinagar", "Gulmarg", "Pahalgam", "Sonmarg Glaciers"],
        hotel: "4★ Premium Hotels & Houseboat",
        inclusions: ["6 Nights Stay", "Breakfast & Dinner", "Shikara Ride", "Private Innova Cab"],
        exclusions: ["Gondola tickets", "Pony rides"],
        itinerary: [
          { day: "Day 1", title: "Srinagar Airport Pick-up", desc: "Houseboat check-in and Dal lake sunset." },
          { day: "Day 2", title: "Mughal Gardens Tour", desc: "Explore historical royal gardens." },
          { day: "Day 3", title: "Sonmarg Glacier Day Trip", desc: "Thajiwas glacier snow point visit." },
          { day: "Day 4", title: "Srinagar to Gulmarg Stay", desc: "Gondola cable car ride and golf course walk." },
          { day: "Day 5", title: "Gulmarg to Pahalgam", desc: "Pine forest walks and Lidder River." },
          { day: "Day 6", title: "Pahalgam Valleys Excursion", desc: "Chandwari and Betaab Valley tour." },
          { day: "Day 7", title: "Srinagar Departure", desc: "Airport drop off." }
        ]
      }
    ]
  },

  "ladakh": {
    id: "ladakh",
    title: "Leh-Ladakh Packages",
    category: "Domestic",
    banner: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=85",
    description: "Land of High Passes! Experience Pangong Tso Lake, Nubra Valley sand dunes, double-humped camels, magnetic hill & Khardung La pass.",
    packages: [
      {
        id: "explore-leh-ladakh",
        title: "Explore Leh-Ladakh Tourism Package",
        duration: "5 Days / 4 Nights",
        price: "₹8,669",
        priceNum: 8669,
        perPerson: true,
        tag: "Adventure Special",
        image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 154,
        highlights: ["Pangong Tso Blue Lake", "Nubra Valley Sand Dunes", "Khardung La Pass (17,582 ft)", "Diskit Monastery", "Magnetic Hill"],
        hotel: "3★ Deluxe Hotel in Leh + Luxury Cottage Camp at Nubra Valley",
        inclusions: [
          "3 Nights Hotel Stay in Leh + 1 Night Deluxe Camp in Nubra Valley",
          "Daily Breakfast & Buffet Dinner at all stays",
          "Private Non-AC Xylo / Scorpio for all high-altitude mountain passes",
          "Inner Line Permits (ILP) & Wildlife Fee for Pangong & Nubra",
          "Oxygen Cylinder in vehicle for high altitude safety",
          "Airport pickup and drop at Kushok Bakula Rimpochee Airport"
        ],
        exclusions: ["Airfare to Leh", "Camel ride in Hunder", "Personal equipment rentals"],
        itinerary: [
          { day: "Day 1", title: "Arrival in Leh & Acclimatization", desc: "Meet at Leh Airport. Transfer to hotel. Full day rest for oxygen acclimatization. Evening walk at Leh Market." },
          { day: "Day 2", title: "Leh Local & Sham Valley Tour", desc: "Visit Magnetic Hill, Gurudwara Pathar Sahib, Sangam (Confluence of Indus & Zanskar rivers), and Hall of Fame." },
          { day: "Day 3", title: "Leh to Nubra Valley via Khardung La", desc: "Cross Khardung La Pass (one of the world's highest motorable roads). Visit Diskit Monastery and enjoy camel ride at Hunder sand dunes." },
          { day: "Day 4", title: "Nubra Valley to Pangong Tso Lake", desc: "Drive along Shyok River to Pangong Lake. Marvel at changing shades of blue water. Stay in luxury camps by the lake." },
          { day: "Day 5", title: "Pangong Lake back to Leh & Departure", desc: "Morning sunrise at Pangong, drive back via Chang La Pass to Leh, transfer to airport for morning flight." }
        ]
      }
    ]
  },

  // --- INTERNATIONAL PACKAGES ---
  "malaysia": {
    id: "malaysia",
    title: "Malaysia Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=85",
    description: "Modern skylines and rainforests! Visit Kuala Lumpur Petronas Towers, Genting Highlands cable car, Batu Caves, and Penang beaches.",
    packages: [
      {
        id: "fascinating-singapore-malaysia",
        title: "Fascinating Singapore & Malaysia Tour",
        duration: "7 Days / 6 Nights",
        price: "₹10,000",
        priceNum: 10000,
        perPerson: true,
        tag: "Combo Special",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 198,
        highlights: ["Petronas Twin Towers KL", "Genting Highlands Cable Car", "Batu Caves Murugan Statue", "Sentosa Island Singapore", "Universal Studios"],
        hotel: "4★ City Hotels in Kuala Lumpur & Singapore",
        inclusions: [
          "3 Nights Stay in Kuala Lumpur + 3 Nights Stay in Singapore",
          "Daily Breakfast",
          "KL City Tour with Petronas Twin Towers photo stop",
          "Genting Highlands Day Tour with 2-way Cable Car Ride",
          "Batu Caves Temple visit",
          "Luxury Coach transfer between KL and Singapore",
          "Singapore City Tour & Sentosa Cable Car Pass"
        ],
        exclusions: ["International Flights & Visa Fees", "Meals not specified", "Universal Studios entry ticket"],
        itinerary: [
          { day: "Day 1", title: "Arrival Kuala Lumpur & KL Tower", desc: "Meet & greet at KLIA Airport. Check-in at hotel. Evening KL city illumination tour." },
          { day: "Day 2", title: "Batu Caves & Genting Highlands", desc: "Visit Batu Caves, then ride Genting SkyWay cable car to Genting Highlands resort and casino." },
          { day: "Day 3", title: "Kuala Lumpur City Sightseeing", desc: "Explore Merdeka Square, National Mosque, King's Palace, and shopping at Bukit Bintang." },
          { day: "Day 4", title: "Coach to Singapore & Night Safari", desc: "Transfer by express coach to Singapore. Check-in and evening Night Safari tram ride." },
          { day: "Day 5", title: "Singapore City & Sentosa Island", desc: "Merlion Park, Gardens by the Bay (Flower Dome & Cloud Forest), and Sentosa Cable Car." },
          { day: "Day 6", title: "Universal Studios Day", desc: "Full day thrill at Universal Studios Singapore on Resort World Sentosa." },
          { day: "Day 7", title: "Departure Singapore", desc: "Shopping at Changi Jewel Airport and flight back to India." }
        ]
      }
    ]
  },

  "singapore": {
    id: "singapore",
    title: "Singapore Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
    description: "The Lion City! Gardens by the Bay, Marina Bay Sands, Sentosa Island, Universal Studios, and luxury Singapore River cruises.",
    packages: [
      {
        id: "spectacular-singapore-cruise",
        title: "Spectacular Singapore With Cruise",
        duration: "9 Days / 8 Nights",
        price: "₹38,000",
        priceNum: 38000,
        perPerson: true,
        tag: "Luxury Cruise",
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 145,
        highlights: ["Resorts World Cruise 2 Nights", "Marina Bay Sands SkyPark", "Universal Studios Singapore", "Gardens by the Bay", "Sentosa Wings of Time"],
        hotel: "4★ Singapore Hotel + 2 Nights Oceanview Cruise Stateroom",
        inclusions: [
          "6 Nights Hotel Stay + 2 Nights Cruise Cabin Stay",
          "All meals on Cruise (Breakfast, Lunch, High-tea & Dinner)",
          "Daily Breakfast at Singapore Hotel",
          "Sentosa Island Tour with Cable Car & Wings of Time Show",
          "Gardens by the Bay 2 Domes entry tickets",
          "Private Airport & Cruise Terminal Transfers"
        ],
        exclusions: ["Airfare & Visa Fees", "Cruise gratuity taxes"],
        itinerary: [
          { day: "Day 1", title: "Arrival Singapore", desc: "Transfer to city hotel, evening leisure at Clarke Quay." },
          { day: "Day 2", title: "City Tour & Gardens by the Bay", desc: "Merlion park, Chinatown, Cloud Forest & Flower Dome." },
          { day: "Day 3", title: "Board Genting / Resorts World Cruise", desc: "Transfer to Marina Bay Cruise Center, board cruise, evening entertainment on deck." },
          { day: "Day 4", title: "Full Day High Seas Experience", desc: "Pool games, casino, live theater performances, and world buffet dining." },
          { day: "Day 5", title: "Disembark Cruise & Sentosa Island", desc: "Disembark cruise, check in hotel, visit Sentosa Island." },
          { day: "Day 6", title: "Universal Studios Singapore", desc: "Full day theme park access." },
          { day: "Day 7", title: "Night Safari & Shopping", desc: "Orchard Road shopping and evening Night Safari." },
          { day: "Day 8", title: "Jewel Changi Airport", desc: "Visit HSBC Rain Vortex waterfall at Changi." },
          { day: "Day 9", title: "Departure", desc: "Fly back home." }
        ]
      }
    ]
  },

  "thailand": {
    id: "thailand",
    title: "Thailand Packages",
    category: "International",
    banner: "assets/packages-images/thailand.jpg",
    description: "Land of Smiles! Bangkok golden temples, Pattaya Coral Island speedboats, Phuket beaches, Safari World, and vibrant street markets.",
    packages: [
      {
        id: "tantalizing-thailand",
        title: "Tantalizing Thailand Vacation",
        duration: "5 Days / 4 Nights",
        price: "₹7,500",
        priceNum: 7500,
        perPerson: true,
        tag: "Super Saver",
        image: "assets/packages-images/thailand.jpg",
        rating: "4.9",
        reviewsCount: 320,
        highlights: ["Pattaya Coral Island Speedboat", "Indian Buffet Lunch at Island", "Alcazar Cabaret Show", "Bangkok City Temple Tour", "Gems Gallery"],
        hotel: "3★ / 4★ Hotel in Pattaya & Bangkok",
        inclusions: [
          "2 Nights Stay in Pattaya + 2 Nights Stay in Bangkok",
          "Daily Breakfast",
          "Speedboat ride to Coral Island with Indian Buffet Lunch",
          "Alcazar Cabaret Show regular ticket",
          "Bangkok City & Temple Tour (Wat Traimit Golden Buddha & Wat Pho)",
          "All transfers in Shared / Private AC Coach"
        ],
        exclusions: ["Thailand Tourist Visa on Arrival fees", "Flight tickets"],
        itinerary: [
          { day: "Day 1", title: "Arrival Bangkok to Pattaya Transfer", desc: "Land at Suvarnabhumi Airport. Drive to Pattaya resort. Evening Alcazar Cabaret Show." },
          { day: "Day 2", title: "Coral Island Speedboat Tour", desc: "Speedboat ride to Coral Island (Koh Larn). Enjoy watersports, beach relaxation, and hot Indian lunch." },
          { day: "Day 3", title: "Pattaya to Bangkok & Temple Tour", desc: "Drive to Bangkok. Visit Wat Traimit (Golden Buddha) & Marble Temple. Check-in at hotel." },
          { day: "Day 4", title: "Bangkok Shopping & Chao Phraya Cruise", desc: "Free day for shopping at Platinum Mall & MBK Center. Optional Chao Phraya Princess Dinner Cruise." },
          { day: "Day 5", title: "Airport Departure", desc: "Check out and private transfer to Bangkok airport." }
        ]
      }
    ]
  },

  "srilanka": {
    id: "srilanka",
    title: "Srilanka Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=85",
    description: "Pearl of the Indian Ocean! Ancient Sigiriya rock fortress, Kandy Temple of Tooth, Nuwara Eliya tea estates, Bentota beaches, and wildlife safaris.",
    packages: [
      {
        id: "best-of-srilanka",
        title: "Best Of Srilanka Tour",
        duration: "6 Days / 5 Nights",
        price: "₹13,500",
        priceNum: 13500,
        perPerson: true,
        tag: "Heritage & Beach",
        image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=85",
        rating: "4.8",
        reviewsCount: 88,
        highlights: ["Pinnawala Elephant Orphanage", "Kandy Sacred Tooth Relic Temple", "Nuwara Eliya Little England", "Bentota Water Sports", "Colombo City Shopping"],
        hotel: "4★ Resort Stays in Kandy, Nuwara Eliya, Bentota & Colombo",
        inclusions: [
          "5 Nights Accommodation in Handpicked Hotels",
          "Daily Breakfast & Dinner",
          "Private AC Vehicle with English Speaking Tourist Driver",
          "Pinnawala Elephant Orphanage Entrance Ticket",
          "Cultural Dance Show in Kandy",
          "Madu River Boat Safari in Bentota"
        ],
        exclusions: ["Airfare & Srilanka ETA Visa", "Lunch & Entrance fees not specified"],
        itinerary: [
          { day: "Day 1", title: "Colombo Airport to Kandy via Pinnawala", desc: "Arrive at Bandaranaike Airport. Drive to Kandy visiting Pinnawala Elephant Orphanage. Evening Kandy cultural show." },
          { day: "Day 2", title: "Kandy to Nuwara Eliya Tea Country", desc: "Visit Temple of Tooth, Peradeniya Botanical Gardens, and scenic waterfall drive to Nuwara Eliya tea gardens." },
          { day: "Day 3", title: "Nuwara Eliya Hill Station", desc: "Visit Gregory Lake, Hakgala Botanical Garden, and tea factory tasting session." },
          { day: "Day 4", title: "Nuwara Eliya to Bentota Beach", desc: "Drive to coastal town Bentota. Relax on gold sand beaches." },
          { day: "Day 5", title: "Madu River Boat Safari & Turtle Hatchery", desc: "Boat safari through mangrove forests of Madu river and Kosgoda turtle conservation center." },
          { day: "Day 6", title: "Colombo City Tour & Airport Drop", desc: "Colombo city shopping (Pettah, Independence Square) and airport drop." }
        ]
      }
    ]
  },

  "dubai": {
    id: "dubai",
    title: "Dubai Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    description: "City of Gold! Burj Khalifa 124th floor view, Desert Safari dune bashing with BBQ dinner, Dhow Cruise, Dubai Frame, and Miracle Garden.",
    packages: [
      {
        id: "mystical-dubai-tour",
        title: "Mystical Dubai Tour Package",
        duration: "4 Days / 3 Nights",
        price: "₹12,550",
        priceNum: 12550,
        perPerson: true,
        tag: "Best Seller",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 280,
        highlights: ["Burj Khalifa 124th Floor Observation Deck", "4x4 Desert Safari with Dune Bashing", "Belly Dance & Tanoura Show with BBQ", "Marina Dhow Cruise Dinner", "Dubai City Tour"],
        hotel: "4★ Hotel in Bur Dubai / Deira",
        inclusions: [
          "3 Nights Accommodation in 4★ Hotel",
          "Daily Breakfast",
          "Half Day Dubai City Tour with English Speaking Guide",
          "Burj Khalifa 124th Floor At The Top Entry Ticket",
          "Desert Safari by 4x4 Land Cruiser with BBQ Dinner & Live Shows",
          "Dubai Marina Dhow Cruise with Buffet Dinner",
          "Return Airport Transfers from Dubai International Airport (DXB)"
        ],
        exclusions: ["UAE Tourist Visa & OTB charges", "Tourism Dirham Fee", "Flight tickets"],
        itinerary: [
          { day: "Day 1", title: "Arrival Dubai & Marina Dhow Cruise", desc: "Arrive at DXB Airport. Pick up and hotel check-in. Evening romantic 2-hour Marina Dhow Cruise with buffet dinner & skyline views." },
          { day: "Day 2", title: "City Tour & Burj Khalifa", desc: "Morning city tour visiting Jumeirah Mosque, Burj Al Arab photo stop, Atlantis Palm. Afternoon visit to Burj Khalifa 124th floor observation deck & Dubai Mall fountains." },
          { day: "Day 3", title: "Desert Safari with BBQ Dinner", desc: "Morning leisure for shopping at Gold Souk. 3:00 PM pick up for 4x4 Desert Safari, dune bashing, camel rides, henna painting & BBQ dinner under stars." },
          { day: "Day 4", title: "Departure Dubai", desc: "Breakfast, check out, optional Miracle Garden tour, and drop off at DXB Airport." }
        ]
      }
    ]
  },

  "hong-kong": {
    id: "hong-kong",
    title: "Hong Kong Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1506970845246-18f21d533b20?auto=format&fit=crop&w=1200&q=85",
    description: "Asia's World City! Victoria Peak tram, Disneyland Hong Kong theme park, Ocean Park, Macau Venetian casino ferry tour.",
    packages: [
      {
        id: "enthralling-hongkong-macau",
        title: "Enthralling Hong Kong & Macau",
        duration: "6 Days / 5 Nights",
        price: "₹26,000",
        priceNum: 26000,
        perPerson: true,
        tag: "Theme Park & Casino",
        image: "https://images.unsplash.com/photo-1506970845246-18f21d533b20?auto=format&fit=crop&w=1200&q=85",
        rating: "4.8",
        reviewsCount: 104,
        highlights: ["Hong Kong Disneyland Pass", "Victoria Peak Tram", "TurboJET Ferry to Macau", "Ruins of St. Paul Macau", "The Venetian Resort"],
        hotel: "4★ Hotels in Kowloon & Macau Peninsula",
        inclusions: [
          "3 Nights HK Hotel + 2 Nights Macau Hotel",
          "Daily Breakfast",
          "Full day Hong Kong Disneyland 1-Day Pass",
          "Hong Kong Island City Tour with Peak Tram 1-way ticket",
          "Round-trip Ferry Tickets (HK - Macau - HK)",
          "Macau City Tour visiting Venetian Casino"
        ],
        exclusions: ["Airfare & Visas", "Personal expenditure"],
        itinerary: [
          { day: "Day 1", title: "Arrival Hong Kong", desc: "Transfer to Kowloon hotel, evening Avenue of Stars laser light show." },
          { day: "Day 2", title: "Hong Kong City & Victoria Peak", desc: "Jewelry factory, Repulse Bay, Aberdeen Fishing Village, and Victoria Peak tram." },
          { day: "Day 3", title: "Disneyland Magic Day", desc: "Full day magical access to 7 lands at Hong Kong Disneyland." },
          { day: "Day 4", title: "Ferry to Macau & Venetian Tour", desc: "Board high-speed TurboJet ferry to Macau. Check-in at hotel and visit Venetian Resort." },
          { day: "Day 5", title: "Macau Heritage Tour", desc: "Ruins of St. Paul, Mount Fortress, A-Ma Temple, and Macau Tower view." },
          { day: "Day 6", title: "Departure", desc: "Ferry transfer directly to HK Airport for return flight." }
        ]
      }
    ]
  },

  "europe": {
    id: "europe",
    title: "Europe Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85",
    description: "Grand European Highlights! Romantic Paris Eiffel Tower & Seine Cruise, Swiss Alps Mount Titlis snow, Venice gondola & Rome Colosseum.",
    packages: [
      {
        id: "experience-italy",
        title: "Experience Italy Grand Tour",
        duration: "9 Days / 8 Nights",
        price: "₹65,000",
        priceNum: 65000,
        perPerson: true,
        tag: "European Dream",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 96,
        highlights: ["Rome Colosseum & Vatican City", "Florence Duomo & Leaning Tower of Pisa", "Venice Gondola Ride", "Milan Cathedral"],
        hotel: "4★ Premium City Hotels",
        inclusions: [
          "8 Nights Stay in 4★ Hotels",
          "Daily Continental Breakfast & 5 Indian Dinners",
          "High-speed Frecciarossa Train Tickets (Rome - Florence - Venice)",
          "Vatican Museums & Colosseum Guided Skip-the-line Passes",
          "30-Minute Classic Venetian Gondola Ride",
          "Luxury AC Coach for all sightseeing & transfers"
        ],
        exclusions: ["Schengen Visa & Travel Insurance", "International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Rome", desc: "Welcome to Italy. Transfer to hotel, evening walking tour of Trevi Fountain & Spanish Steps." },
          { day: "Day 2", title: "Rome & Vatican City", desc: "Guided tour of St. Peter's Basilica, Sistine Chapel, and Ancient Colosseum." },
          { day: "Day 3", title: "Rome to Florence via Pisa", desc: "Train to Tuscany. Stop at Field of Miracles to admire Leaning Tower of Pisa. Stay in Florence." },
          { day: "Day 4", title: "Florence Renaissance Art", desc: "Visit Duomo Cathedral, Ponte Vecchio, and Piazza della Signoria." },
          { day: "Day 5", title: "Florence to Venice Water City", desc: "High-speed train to Venice. Vaporetto ride to St. Mark's Square." },
          { day: "Day 6", title: "Venice Canal & Gondola Tour", desc: "Gondola ride through romantic canals, Doge's Palace photo stop, Murano glass blowing factory." },
          { day: "Day 7", title: "Venice to Milan", desc: "Drive to Milan fashion capital. Visit Duomo di Milano & Galleria Vittorio Emanuele II." },
          { day: "Day 8", title: "Lake Como Day Trip", desc: "Excursion to scenic Lake Como and Bellagio village." },
          { day: "Day 9", title: "Departure Milan", desc: "Transfer to Malpensa Airport." }
        ]
      }
    ]
  },

  // --- SPECIAL PACKAGES ---
  "bali": {
    id: "bali",
    title: "Bali Packages",
    category: "Special",
    banner: "assets/packages-images/bali.jpg",
    description: "Island of the Gods! Luxury private pool villas, Ubud jungle swings, Kintamani volcano, Uluwatu cliff temple & sunset Kecak dance.",
    packages: [
      {
        id: "amazing-bali-holiday",
        title: "Amazing Bali Holiday Package",
        duration: "5 Days / 4 Nights",
        price: "₹5,569",
        priceNum: 5569,
        perPerson: true,
        tag: "Luxury Villa",
        image: "assets/packages-images/bali.jpg",
        rating: "4.9",
        reviewsCount: 265,
        highlights: ["Private Pool Villa Stay 2 Nights", "Ubud Jungle Swing & Rice Terraces", "Kintamani Volcano View", "Uluwatu Sunset Temple & Kecak Dance", "Water Sports at Tanjung Benoa"],
        hotel: "4★ Resort in Kuta + 1-Bedroom Private Pool Villa in Ubud",
        inclusions: [
          "2 Nights Hotel in Kuta + 2 Nights Private Pool Villa in Ubud",
          "Daily Breakfast & 1 Romantic Floating Breakfast",
          "Banana Boat ride at Tanjung Benoa",
          "Full Day Kintamani Volcano & Ubud Handicraft Villages Tour",
          "Uluwatu Cliff Temple tour with Kecak Fire Dance tickets",
          "Private AC Car with Driver for all transfers"
        ],
        exclusions: ["Flight tickets to Denpasar (DPS)", "Personal watersports upgrades"],
        itinerary: [
          { day: "Day 1", title: "Arrival Bali & Kuta Check-in", desc: "Land at Bali Denpasar Airport. Warm flower garland welcome. Transfer to Kuta resort." },
          { day: "Day 2", title: "Water Sports & Uluwatu Sunset", desc: "Banana boat ride at Benoa beach. Afternoon visit to Uluwatu Temple perched on 70m cliff, watch Kecak dance at sunset." },
          { day: "Day 3", title: "Transfer to Ubud Villa & Kintamani Tour", desc: "Check-in at luxury Ubud private pool villa. Visit Tegalalang Rice Terraces, Ubud Swing, and Mount Batur Volcano point." },
          { day: "Day 4", title: "Wanagiri Hidden Hills & Ulun Danu Temple", desc: "Visit Lake Beratan Water Temple and Wanagiri iconic photo swings." },
          { day: "Day 5", title: "Souvenir Shopping & Airport Transfer", desc: "Floating breakfast in private pool villa, Krisna souvenir shopping, transfer to airport." }
        ]
      }
    ]
  },

  "mauritius": {
    id: "mauritius",
    title: "Mauritius Packages",
    category: "Special",
    banner: "assets/packages-images/mauritius.jpg",
    description: "Tropical Paradise! Chamarel 7-Coloured Earth, Ile aux Cerfs speedboat cruise, Trou aux Cerfs volcano crater & luxury beach resorts.",
    packages: [
      {
        id: "luxurious-mauritius-tour",
        title: "Luxurious Mauritius Tour",
        duration: "6 Days / 5 Nights",
        price: "₹39,000",
        priceNum: 39000,
        perPerson: true,
        tag: "Island Retreat",
        image: "assets/packages-images/mauritius.jpg",
        rating: "4.9",
        reviewsCount: 112,
        highlights: ["Ile aux Cerfs Speedboat Cruise", "Undersea Walk Experience", "Chamarel 7-Coloured Earth", "Grand Bassin Sacred Lake", "Port Louis Waterfront"],
        hotel: "5★ Oceanfront Beach Resort",
        inclusions: [
          "5 Nights Stay in 5★ Beach Resort",
          "Daily Breakfast & Gourmet Buffet Dinner",
          "Full Day Ile aux Cerfs Island Tour by Speedboat with BBQ Lunch",
          "Full Day South Tour (Chamarel, Trou aux Cerfs, Grand Bassin)",
          "Full Day North Tour (Port Louis, Caudan Waterfront, Citadel)",
          "Private AC Coach Transfers"
        ],
        exclusions: ["International Airfare", "Scuba Diving"],
        itinerary: [
          { day: "Day 1", title: "Arrival Mauritius", desc: "Transfer to 5-star beach resort, welcome cocktail." },
          { day: "Day 2", title: "North Island Tour", desc: "Port Louis capital city, Citadel fort, Caudan waterfront shopping." },
          { day: "Day 3", title: "South Island Tour", desc: "Trou aux Cerfs dormant volcano, Grand Bassin sacred lake, Chamarel 7 coloured earth." },
          { day: "Day 4", title: "Ile aux Cerfs Cruise", desc: "Speedboat ride to island lagoon, parasailing option, seafood BBQ lunch." },
          { day: "Day 5", title: "Resort Leisure & Watersports", desc: "Kayaking, glass bottom boat ride, beach relaxation." },
          { day: "Day 6", title: "Departure", desc: "Transfer to airport." }
        ]
      }
    ]
  },

  "maldives": {
    id: "maldives",
    title: "Maldives Packages",
    category: "Special",
    banner: "assets/packages-images/maldives.jpg",
    description: "Pure Luxury! Overwater villas with glass floor panels, speedboat/seaplane transfers, house reef snorkeling & romantic sunset dinners.",
    packages: [
      {
        id: "mesmerising-maldives-escape",
        title: "Mesmerising Maldives Escape",
        duration: "4 Days / 3 Nights",
        price: "₹28,500",
        priceNum: 28500,
        perPerson: true,
        tag: "Overwater Villa",
        image: "assets/packages-images/maldives.jpg",
        rating: "5.0",
        reviewsCount: 310,
        highlights: ["Luxury Water Villa Stay", "Speedboat Airport Transfer", "All-Inclusive Meals & Drinks", "House Reef Snorkeling", "Sunset Dolphin Cruise"],
        hotel: "5★ Resort Overwater Villa",
        inclusions: [
          "2 Nights Beach Villa + 1 Night Ocean Water Villa with direct sea access",
          "All-Inclusive Plan: Breakfast, Lunch, Dinner & Unlimited Select Beverages",
          "Round-trip Airport Speedboat Transfers",
          "Complimentary Snorkeling Equipment rental",
          "1 Sunset Dolphin Cruise per person"
        ],
        exclusions: ["Airfare to Male (MLE)", "Seaplane upgrades"],
        itinerary: [
          { day: "Day 1", title: "Arrival Male & Speedboat Transfer", desc: "Arrive at Velana International Airport. High-speed boat transfer to resort. Check-in Beach Villa." },
          { day: "Day 2", title: "Water Sports & Dolphin Cruise", desc: "Snorkeling on house reef, evening sunset dolphin watching cruise." },
          { day: "Day 3", title: "Water Villa Check-in & Candlelight Dinner", desc: "Move to Overwater Bungalow. Dip straight into crystal ocean from deck. Romantic candlelight dinner by beach." },
          { day: "Day 4", title: "Departure Male", desc: "Breakfast, island walk, speedboat to airport for flight home." }
        ]
      }
    ]
  },

  "south-africa": {
    id: "south-africa",
    title: "South Africa Packages",
    category: "Special",
    banner: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85",
    description: "Wild Safari & Coastal Splendor! Big 5 game drive at Kruger National Park, Cape Town Table Mountain cable car & Boulders Penguin Colony.",
    packages: [
      {
        id: "enchanting-south-africa",
        title: "Enchanting South Africa Safari & Cape",
        duration: "9 Days / 8 Nights",
        price: "₹55,000",
        priceNum: 55000,
        perPerson: true,
        tag: "Wildlife Safari",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 84,
        highlights: ["Kruger National Park Big 5 Open Jeep Safari", "Cape Town Table Mountain Cable Car", "Cape of Good Hope & Boulders Beach Penguins", "Sun City Entertainment Resort"],
        hotel: "4★ Hotels & Game Lodges",
        inclusions: [
          "8 Nights Accommodation in 4★ Hotels & Game Lodge",
          "Daily Breakfast & 2 Safari Dinners",
          "Full Day Open 4x4 Game Drive in Kruger National Park",
          "Cape Town City & Cable Car Pass",
          "Cape Peninsula Tour visiting Cape point & Penguin colony",
          "Internal Flight (Johannesburg to Cape Town)"
        ],
        exclusions: ["International Flights & South Africa Visa", "Personal expenses"],
        itinerary: [
          { day: "Day 1", title: "Arrival Johannesburg to Sun City", desc: "Arrive at JNB airport, drive to Sun City resort." },
          { day: "Day 2", title: "Sun City Valley of Waves", desc: "Explore wave pool, casino, and golf course." },
          { day: "Day 3", title: "Drive to Kruger Lodge", desc: "Scenic drive to Kruger safari game lodge." },
          { day: "Day 4", title: "Full Day Big 5 Game Safari", desc: "Dawn to dusk 4x4 open jeep safari spotting Lions, Elephants, Leopards, Rhinos & Buffalos." },
          { day: "Day 5", title: "Flight to Cape Town", desc: "Fly to Cape Town, evening V&A Waterfront." },
          { day: "Day 6", title: "Table Mountain & City Tour", desc: "Cable car up Table Mountain, Bo-Kaap colorful houses." },
          { day: "Day 7", title: "Cape Peninsula & Penguins", desc: "Hout Bay boat ride, Cape Point, Boulders Beach penguin colony." },
          { day: "Day 8", title: "Stellenbosch Wine Tasting", desc: "Visit historic Stellenbosch winelands." },
          { day: "Day 9", title: "Departure Cape Town", desc: "Airport drop." }
        ]
      }
    ]
  },

  "turkey": {
    id: "turkey",
    title: "Turkey Packages",
    category: "Special",
    banner: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
    description: "Where East meets West! Hot air balloon in Cappadocia fairy chimneys, Istanbul Hagia Sophia, Blue Mosque & Pamukkale thermal springs.",
    packages: [
      {
        id: "ravishing-turkey",
        title: "Ravishing Turkey Grand Tour",
        duration: "8 Days / 7 Nights",
        price: "₹42,000",
        priceNum: 42000,
        perPerson: true,
        tag: "Hot Air Balloon",
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 172,
        highlights: ["Cappadocia Hot Air Balloon Ride Option", "Cave Hotel Stay", "Istanbul Hagia Sophia & Bosphorus Cruise", "Pamukkale Travertines & Hierapolis"],
        hotel: "4★ Istanbul Hotel + Authentic Cave Hotel in Cappadocia",
        inclusions: [
          "4 Nights Istanbul Hotel + 3 Nights Cappadocia Cave Hotel",
          "Daily Breakfast",
          "Istanbul Bosphorus Dinner Cruise with Turkish Night Show",
          "Cappadocia Red Tour (Goreme Open Air Museum & Fairy Chimneys)",
          "Pamukkale & Hierapolis Thermal Springs Day Excursion",
          "Domestic Flights (Istanbul - Cappadocia - Denizli - Istanbul)"
        ],
        exclusions: ["International Flights & Turkey E-Visa", "Hot Air Balloon Flight Fee (~€150)"],
        itinerary: [
          { day: "Day 1", title: "Arrival Istanbul & Bosphorus Cruise", desc: "Transfer to hotel. Evening Bosphorus dinner cruise with Turkish belly dance." },
          { day: "Day 2", title: "Istanbul Historical Tour", desc: "Hagia Sophia, Blue Mosque, Topkapi Palace, Grand Bazaar." },
          { day: "Day 3", title: "Flight to Cappadocia & Cave Hotel", desc: "Domestic flight to Nevsehir/Kayseri. Check-in at unique Cave Hotel." },
          { day: "Day 4", title: "Cappadocia Hot Air Balloon & Red Tour", desc: "Optional sunrise hot air balloon flight over valleys. Visit Goreme Open Air Museum & Underground City." },
          { day: "Day 5", title: "Cappadocia ATV Quad Safari", desc: "Pasabag monk valley photo stop and evening sunset quad bike safari." },
          { day: "Day 6", title: "Pamukkale Thermal Springs", desc: "Flight/drive to Denizli. Walk on white travertine terraces of Pamukkale." },
          { day: "Day 7", title: "Return Istanbul & Shopping", desc: "Fly back to Istanbul, Taksim Square shopping." },
          { day: "Day 8", title: "Departure", desc: "Airport drop." }
        ]
      }
    ]
  },

  "vietnam": {
    id: "vietnam",
    title: "Vietnam Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85",
    description: "Land of Emerald Waters! Cruise in Ha Long Bay, Old Quarter Hanoi, Ba Na Hills Golden Hands Bridge, and Lantern City Hoi An.",
    packages: [
      {
        id: "exotic-vietnam-ha-long",
        title: "Exotic Vietnam & Ha Long Bay Cruise",
        duration: "6 Days / 5 Nights",
        price: "₹19,500",
        priceNum: 19500,
        perPerson: true,
        tag: "Heritage Cruise",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 124,
        highlights: ["Ha Long Bay Overnight Luxury Cruise", "Hanoi Old Quarter Rickshaw Tour", "Golden Hands Bridge Ba Na Hills", "Hoi An Ancient Lantern Town"],
        hotel: "4★ Hotel in Hanoi & Da Nang + 1 Night Ha Long Cruise Cabin",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast & All Meals on Cruise", "Ha Long Kayaking Session", "Private Cab & Cable Car Pass"],
        exclusions: ["Visa Fees & International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Hanoi", desc: "Greeting at Noi Bai Airport. Hotel check in. Water puppet show in Hanoi Old Quarter." },
          { day: "Day 2", title: "Hanoi to Ha Long Bay Cruise", desc: "Board luxury cruise ship at Tuan Chau harbor. Kayak through limestone karst caves." },
          { day: "Day 3", title: "Ha Long Bay to Da Nang Flight", desc: "Tai Chi sunrise session, disembark cruise, flight to Da Nang beach city." },
          { day: "Day 4", title: "Ba Na Hills & Golden Bridge", desc: "Ride cable car to Ba Na Hills, walk on Giant Golden Hands Bridge." },
          { day: "Day 5", title: "Hoi An Ancient Lantern Town", desc: "Explore lantern-lit Japanese Covered Bridge and night market." },
          { day: "Day 6", title: "Departure Da Nang", desc: "Airport drop for flight home." }
        ]
      }
    ]
  },

  "japan": {
    id: "japan",
    title: "Japan Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85",
    description: "Land of the Rising Sun! Bullet train Shinkansen, Mount Fuji 5th Station, Kyoto Kinkaku-ji Golden Pavilion & Tokyo Shibuya Crossing.",
    packages: [
      {
        id: "majestic-japan-cherry-blossom",
        title: "Majestic Japan Express",
        duration: "7 Days / 6 Nights",
        price: "₹48,000",
        priceNum: 48000,
        perPerson: true,
        tag: "Shinkansen Bullet Train",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 168,
        highlights: ["Mount Fuji Panorama Lake Kawaguchiko", "Shinkansen Bullet Train (Tokyo - Kyoto)", "Tokyo Shibuya & Sensoji Temple", "Kyoto Fushimi Inari Torii Gates"],
        hotel: "4★ Central Hotels in Tokyo & Kyoto",
        inclusions: ["6 Nights Stay", "Daily Buffet Breakfast", "JR Shinkansen Bullet Train Pass", "English Speaking Tour Guide"],
        exclusions: ["Visa Fees & Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Tokyo", desc: "Transfer from Narita/Haneda Airport to hotel." },
          { day: "Day 2", title: "Tokyo City Tour", desc: "Sensoji Temple in Asakusa, Tokyo Skytree photo stop, Shibuya Crossing." },
          { day: "Day 3", title: "Mount Fuji & Hakone Lake Cruise", desc: "Drive to Mt. Fuji 5th station, pirate ship cruise on Lake Ashi." },
          { day: "Day 4", title: "Bullet Train to Kyoto", desc: "Ride Shinkansen bullet train to Kyoto. Visit Fushimi Inari Shrine." },
          { day: "Day 5", title: "Kyoto Golden Temple & Arashiyama Bamboo Grove", desc: "Kinkaku-ji Golden Pavilion and Arashiyama Bamboo Forest walk." },
          { day: "Day 6", title: "Nara Deer Park & Osaka Castle", desc: "Feed friendly bowing deer at Nara Park and visit Osaka Castle." },
          { day: "Day 7", title: "Departure Kansai/Tokyo", desc: "Transfer to airport for flight home." }
        ]
      }
    ]
  },

  "egypt": {
    id: "egypt",
    title: "Egypt Packages",
    category: "Special",
    banner: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=85",
    description: "Land of Pharaohs! Great Pyramids of Giza, Sphinx, Luxor Valley of the Kings, Karnak Temple, and 5★ Nile River Cruise.",
    packages: [
      {
        id: "wonders-of-egypt-pyramids",
        title: "Wonders of Egypt Pyramids & Nile",
        duration: "7 Days / 6 Nights",
        price: "₹38,500",
        priceNum: 38500,
        perPerson: true,
        tag: "Nile Cruise Special",
        image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=85",
        rating: "4.9",
        reviewsCount: 140,
        highlights: ["Giza Great Pyramids & Sphinx", "3 Nights 5★ Nile River Cruise (Aswan to Luxor)", "Egyptian Museum Tutankhamun Treasures", "Karnak & Luxor Ancient Temples"],
        hotel: "5★ Cairo Hotel + 3 Nights 5★ Nile Cruise Ship Stateroom",
        inclusions: ["3 Nights Cairo Hotel + 3 Nights Nile Cruise", "All meals on Cruise + Daily Breakfast in Cairo", "Domestic Flights (Cairo - Aswan / Luxor - Cairo)", "Licensed Egyptologist Guide"],
        exclusions: ["International Flights & Egypt Visa"],
        itinerary: [
          { day: "Day 1", title: "Arrival Cairo", desc: "Meet & assist at Cairo Airport. Hotel check in." },
          { day: "Day 2", title: "Giza Pyramids & Sphinx", desc: "Guided tour of Great Pyramids of Giza, Sphinx, and Papyrus institute." },
          { day: "Day 3", title: "Fly Aswan & Board Nile Cruise", desc: "Fly to Aswan, board 5-star Nile Cruise, visit Philae Temple & High Dam." },
          { day: "Day 4", title: "Kom Ombo & Edfu Temples", desc: "Sail along Nile River visiting Kom Ombo & Edfu Temples." },
          { day: "Day 5", title: "Luxor Valley of the Kings", desc: "Visit Valley of the Kings, Hatshepsut Temple, Colossi of Memnon & Karnak Temple." },
          { day: "Day 6", title: "Disembark Cruise & Return Cairo", desc: "Fly back to Cairo, visit Egyptian Museum & Khan El Khalili Bazaar." },
          { day: "Day 7", title: "Departure Cairo", desc: "Transfer to airport for return flight." }
        ]
      }
    ]
  },

  "seychelles": {
    id: "seychelles",
    title: "Seychelles Packages",
    category: "Special",
    banner: "assets/packages-images/seychelles.jpg",
    description: "Unspoiled Indian Ocean Haven! Anse Source d'Argent granite boulder beaches, Praslin Coco de Mer palm forest, and La Digue Island.",
    packages: [
      {
        id: "pristine-seychelles-island",
        title: "Pristine Seychelles Beach Escape",
        duration: "5 Days / 4 Nights",
        price: "₹42,500",
        priceNum: 42500,
        perPerson: true,
        tag: "Island Sanctuary",
        image: "assets/packages-images/seychelles.jpg",
        rating: "5.0",
        reviewsCount: 95,
        highlights: ["Anse Source d'Argent Granite Beach", "Vallée de Mai UNESCO World Heritage", "La Digue Island Bicycle Tour", "Beau Vallon Beach Resort Stay"],
        hotel: "5★ Beachfront Resort on Mahé Island",
        inclusions: ["4 Nights 5★ Resort Stay", "Daily Breakfast & Dinner", "Cat Cocos Inter-Island Ferry Pass", "Private Airport Transfers"],
        exclusions: ["International Flights & Personal Expenses"],
        itinerary: [
          { day: "Day 1", title: "Arrival Mahé Seychelles", desc: "Greeting at Seychelles Airport. Private transfer to Beau Vallon beach resort." },
          { day: "Day 2", title: "Praslin Island & Vallée de Mai", desc: "Cat Cocos ferry to Praslin Island, visit Vallée de Mai giant Coco de Mer palm forest." },
          { day: "Day 3", title: "La Digue Island & Anse Source d'Argent", desc: "Ferry to La Digue island, bicycle rental, visit famous granite boulder beach Anse Source d'Argent." },
          { day: "Day 4", title: "Victoria Capital & Marine Park Snorkeling", desc: "Visit Victoria clocktower, local spice market, and Sainte Anne Marine National Park." },
          { day: "Day 5", title: "Departure Mahé", desc: "Breakfast, beach walk, transfer to airport." }
        ]
      }
    ]
  },
  "safari": {
    id: "safari",
    title: "7 Continents Safari Expeditions",
    category: "Special",
    banner: "assets/packages-images/safari-africa-mara.jpg",
    description: "Experience untamed wilderness across 7 continents — from African savannas and Amazonian rainforests to Asian tiger reserves, Australian outback, and Antarctic ice.",
    packages: [
      {
        id: "africa-kenya-safari",
        title: "Kenya — Maasai Mara Great Migration",
        duration: "6 Days / 5 Nights",
        price: "₹52,000",
        priceNum: 52000,
        perPerson: true,
        tag: "Big Five",
        image: "assets/images/kenya.jpg",
        rating: "5.0",
        reviewsCount: 190,
        highlights: ["Maasai Mara Game Drives", "Mara River Wildebeest Crossing", "Maasai Village Cultural Visit", "Hot Air Balloon Safari (Optional)"],
        hotel: "5★ Luxury Tented Bush Camp",
        inclusions: ["5 Nights Luxury Tented Stay", "All Meals & Sundowners", "Private 4x4 Land Cruiser & Ranger", "Park Passes & Maasai Village Tour"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Nairobi to Maasai Mara", desc: "Drive through Great Rift Valley to luxury Mara camp." },
          { day: "Day 2", title: "Maasai Mara Game Drive", desc: "Track lions, leopards, rhinos, and elephants across savanna." },
          { day: "Day 3", title: "Mara River Crossing Watch", desc: "Full day tracking wildebeest herds at the famous river crossing point." },
          { day: "Day 4", title: "Maasai Village & Bush Walk", desc: "Cultural visit to a Maasai village, guided nature walk with a ranger." },
          { day: "Day 5", title: "Sunrise Balloon Safari (Optional)", desc: "Dawn hot-air balloon flight over the plains, champagne bush breakfast." },
          { day: "Day 6", title: "Nairobi Departure", desc: "Drive back to Nairobi for onward flight." }
        ]
      },
      {
        id: "africa-tanzania-safari",
        title: "Tanzania — Serengeti & Ngorongoro Crater",
        duration: "7 Days / 6 Nights",
        price: "₹58,000",
        priceNum: 58000,
        perPerson: true,
        tag: "Big Five",
        image: "assets/images/tanzania.jpg",
        rating: "4.9",
        reviewsCount: 175,
        highlights: ["Serengeti Migration Tracking", "Ngorongoro Crater Floor", "Lake Manyara Tree-Climbing Lions", "Olduvai Gorge Heritage Site"],
        hotel: "5★ Luxury Tented Bush Camp",
        inclusions: ["6 Nights Luxury Tented Stay", "All Meals & Sundowners", "Private 4x4 Land Cruiser & Ranger", "Park Fees & Crater Entry Permit"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arusha to Lake Manyara", desc: "Drive from Kilimanjaro Airport, afternoon game drive spotting tree-climbing lions." },
          { day: "Day 2", title: "Central Serengeti Plains", desc: "Full day drive into the endless Serengeti plains, first game drive." },
          { day: "Day 3", title: "Full Day Serengeti Predator Tracker", desc: "Witness big cat hunts and massive wildebeest herds." },
          { day: "Day 4", title: "Serengeti Sunrise Game Drive", desc: "Early morning drive when predators are most active." },
          { day: "Day 5", title: "Ngorongoro Crater Floor Safari", desc: "Descend into the ancient volcanic caldera floor for dense wildlife viewing." },
          { day: "Day 6", title: "Olduvai Gorge & Arusha", desc: "Visit the Cradle of Mankind archaeological site en route back." },
          { day: "Day 7", title: "Kilimanjaro Departure", desc: "Transfer to Kilimanjaro Airport." }
        ]
      },
      {
        id: "africa-southafrica-safari",
        title: "South Africa — Kruger Big Five Safari",
        duration: "5 Days / 4 Nights",
        price: "₹47,000",
        priceNum: 47000,
        perPerson: true,
        tag: "Big Five",
        image: "assets/packages-images/safari-africa-kruger.jpg",
        rating: "4.9",
        reviewsCount: 210,
        highlights: ["Kruger Open 4x4 Night Drive", "Sabi Sands Private Reserve", "Big Five Tracking", "Panorama Route Scenic Drive"],
        hotel: "5★ Bush Lodge, Kruger Region",
        inclusions: ["4 Nights Luxury Lodge Stay", "Full Board Meals", "Day & Night Game Drives", "Park Conservation Fees"],
        exclusions: ["Airfare"],
        itinerary: [
          { day: "Day 1", title: "Johannesburg to Kruger Lodge", desc: "Transfer to bush lodge. Sunset open 4x4 drive." },
          { day: "Day 2", title: "Kruger Big Five Exploration", desc: "Full day tracking lion pride and elephant herds." },
          { day: "Day 3", title: "Sabi Sands Private Reserve", desc: "Off-road tracking in the private reserve bordering Kruger." },
          { day: "Day 4", title: "Panorama Route & Blyde River Canyon", desc: "Scenic drive past God's Window and the Three Rondavels." },
          { day: "Day 5", title: "Johannesburg Departure", desc: "Breakfast, transfer to airport." }
        ]
      },
      {
        id: "africa-botswana-safari",
        title: "Botswana — Okavango Delta & Chobe",
        duration: "6 Days / 5 Nights",
        price: "₹61,000",
        priceNum: 61000,
        perPerson: true,
        tag: "Delta Safari",
        image: "assets/packages-images/safari-botswana-real.jpg",
        rating: "4.9",
        reviewsCount: 140,
        highlights: ["Okavango Mokoro Canoe Safari", "Chobe River Elephant Cruise", "Moremi Game Reserve", "Wild Dog Pack Tracking"],
        hotel: "5★ Over-water Eco Bush Lodge",
        inclusions: ["5 Nights Luxury Lodge Stay", "Full Board Meals", "Game Drives & Mokoro Canoes", "Park Permits"],
        exclusions: ["Airfare"],
        itinerary: [
          { day: "Day 1", title: "Maun to Okavango Delta", desc: "Light aircraft transfer into the delta, evening at eco lodge." },
          { day: "Day 2", title: "Okavango Mokoro Canoe Safari", desc: "Glide on traditional Mokoro through reed channels." },
          { day: "Day 3", title: "Moremi Reserve Safari", desc: "Explore rich floodplains and wild dog packs." },
          { day: "Day 4", title: "Fly to Chobe National Park", desc: "Transfer to Chobe riverfront for afternoon game drive." },
          { day: "Day 5", title: "Chobe River Sunset Cruise", desc: "Sunset boat cruise with riverfront elephant herds." },
          { day: "Day 6", title: "Kasane Departure", desc: "Breakfast, transfer to airport." }
        ]
      },
      {
        id: "africa-namibia-safari",
        title: "Namibia — Etosha & Namib Desert",
        duration: "7 Days / 6 Nights",
        price: "₹63,000",
        priceNum: 63000,
        perPerson: true,
        tag: "Desert Safari",
        image: "assets/packages-images/safari-namibia-real.jpg",
        rating: "4.8",
        reviewsCount: 95,
        highlights: ["Etosha Waterhole Game Viewing", "Sossusvlei Red Dunes", "Deadvlei Salt Pan", "Damaraland Desert Elephants"],
        hotel: "4★ Desert & Bush Lodges",
        inclusions: ["6 Nights Lodge Stay", "Daily Breakfast & Dinner", "4x4 Guided Game Drives", "Park Entry Permits"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Windhoek to Etosha National Park", desc: "Drive north into Etosha, evening waterhole viewing." },
          { day: "Day 2", title: "Etosha Full Day Game Drive", desc: "Track elephant, lion, and rhino around floodlit waterholes." },
          { day: "Day 3", title: "Damaraland Desert Elephants", desc: "Search for rare desert-adapted elephants." },
          { day: "Day 4", title: "Swakopmund Coastal Town", desc: "Drive to the Atlantic coast, free time in Swakopmund." },
          { day: "Day 5", title: "Sossusvlei Red Dunes", desc: "Sunrise climb of Dune 45, visit the ghostly Deadvlei salt pan." },
          { day: "Day 6", title: "NamibRand Nature Reserve", desc: "Stargazing under some of the world's darkest skies." },
          { day: "Day 7", title: "Windhoek Departure", desc: "Drive back to Windhoek for onward flight." }
        ]
      },
      {
        id: "africa-uganda-safari",
        title: "Uganda — Bwindi Gorilla Trekking",
        duration: "5 Days / 4 Nights",
        price: "₹68,000",
        priceNum: 68000,
        perPerson: true,
        tag: "Gorilla Trek",
        image: "assets/images/uganda.jpg",
        rating: "4.9",
        reviewsCount: 88,
        highlights: ["Bwindi Impenetrable Forest Gorilla Trek", "Queen Elizabeth National Park Game Drive", "Kazinga Channel Boat Cruise", "Batwa Cultural Encounter"],
        hotel: "4★ Forest Lodge, Bwindi",
        inclusions: ["4 Nights Lodge Stay", "All Meals", "Gorilla Trekking Permit", "Park Ranger & 4x4 Transfers"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Kampala to Bwindi Forest", desc: "Scenic drive to Bwindi Impenetrable Forest region." },
          { day: "Day 2", title: "Mountain Gorilla Trekking", desc: "Guided trek to spend an hour with a habituated gorilla family." },
          { day: "Day 3", title: "Queen Elizabeth National Park", desc: "Transfer for a game drive tracking lion and elephant." },
          { day: "Day 4", title: "Kazinga Channel Boat Cruise", desc: "Boat safari past hippo pods and buffalo herds." },
          { day: "Day 5", title: "Kampala Departure", desc: "Drive back to Kampala for onward flight." }
        ]
      },
      {
        id: "africa-zimbabwe-safari",
        title: "Zimbabwe — Victoria Falls & Mana Pools",
        duration: "6 Days / 5 Nights",
        price: "₹55,000",
        priceNum: 55000,
        perPerson: true,
        tag: "Falls Safari",
        image: "assets/images/zimbabwe.jpg",
        rating: "4.8",
        reviewsCount: 102,
        highlights: ["Victoria Falls Guided Tour", "Mana Pools Canoe Safari", "Zambezi River Sunset Cruise", "Walking Safari with Armed Ranger"],
        hotel: "5★ Riverfront Safari Lodge",
        inclusions: ["5 Nights Lodge Stay", "Full Board Meals", "Canoe & Walking Safaris", "Victoria Falls Park Entry"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Victoria Falls", desc: "Guided tour of the falls, evening at riverfront lodge." },
          { day: "Day 2", title: "Zambezi River Sunset Cruise", desc: "Boat cruise spotting hippo and crocodile along the Zambezi." },
          { day: "Day 3", title: "Fly to Mana Pools National Park", desc: "Transfer to remote floodplain safari camp." },
          { day: "Day 4", title: "Mana Pools Canoe Safari", desc: "Paddle past elephant herds drinking at the riverbank." },
          { day: "Day 5", title: "Walking Safari with Ranger", desc: "Guided bushwalk tracking Big Five spoor on foot." },
          { day: "Day 6", title: "Victoria Falls Departure", desc: "Transfer to airport." }
        ]
      },
      {
        id: "africa-zambia-safari",
        title: "Zambia — Victoria Falls & South Luangwa",
        duration: "6 Days / 5 Nights",
        price: "₹57,000",
        priceNum: 57000,
        perPerson: true,
        tag: "Walking Safari",
        image: "https://images.unsplash.com/photo-1666732566977-8805c13a6ce2?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 76,
        highlights: ["Victoria Falls (Zambia Side)", "South Luangwa Walking Safari", "Night Game Drives", "Leopard Valley Tracking"],
        hotel: "4★ Riverside Bush Camp",
        inclusions: ["5 Nights Lodge Stay", "Full Board Meals", "Day & Night Game Drives", "Walking Safari with Armed Guide"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Livingstone — Victoria Falls", desc: "Guided walking tour of the falls from the Zambian side." },
          { day: "Day 2", title: "Fly to South Luangwa Valley", desc: "Transfer into the valley famed for walking safaris." },
          { day: "Day 3", title: "South Luangwa Walking Safari", desc: "Pioneering on-foot safari tracking leopard and elephant." },
          { day: "Day 4", title: "Leopard Valley Night Drive", desc: "Spotlight drive searching for Luangwa's famous leopards." },
          { day: "Day 5", title: "Full Day Game Drive", desc: "Explore the Luangwa River's oxbow lagoons and hippo pods." },
          { day: "Day 6", title: "Livingstone Departure", desc: "Transfer to airport." }
        ]
      },
      {
        id: "africa-madagascar-safari",
        title: "Madagascar — Baobabs & Lemur Reserves",
        duration: "7 Days / 6 Nights",
        price: "₹66,000",
        priceNum: 66000,
        perPerson: true,
        tag: "Island Safari",
        image: "assets/packages-images/safari-madagascar-baobab.jpg",
        rating: "4.7",
        reviewsCount: 64,
        highlights: ["Avenue of the Baobabs", "Kirindy Forest Night Walk", "Ring-Tailed Lemur Tracking", "Andasibe Rainforest Reserve"],
        hotel: "4★ Eco Lodges",
        inclusions: ["6 Nights Lodge Stay", "Daily Breakfast & Dinner", "Guided Park Walks", "National Park Entry Fees"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Antananarivo to Andasibe", desc: "Drive to the rainforest reserve region." },
          { day: "Day 2", title: "Andasibe Indri Lemur Trek", desc: "Morning walk tracking the largest living lemur species." },
          { day: "Day 3", title: "Fly to Morondava", desc: "Transfer to the western coastal region." },
          { day: "Day 4", title: "Avenue of the Baobabs", desc: "Sunset photography at the iconic baobab alley." },
          { day: "Day 5", title: "Kirindy Forest Night Walk", desc: "Spotlight walk searching for nocturnal lemurs and fossa." },
          { day: "Day 6", title: "Ring-Tailed Lemur Reserve", desc: "Full day tracking troops of ring-tailed lemurs." },
          { day: "Day 7", title: "Antananarivo Departure", desc: "Fly back to the capital for onward flight." }
        ]
      },
      {
        id: "africa-rwanda-safari",
        title: "Rwanda — Volcanoes Gorilla Trek",
        duration: "5 Days / 4 Nights",
        price: "₹72,000",
        priceNum: 72000,
        perPerson: true,
        tag: "Gorilla Trek",
        image: "assets/images/rwanda.jpg",
        rating: "4.9",
        reviewsCount: 70,
        highlights: ["Volcanoes National Park Gorilla Trek", "Golden Monkey Tracking", "Dian Fossey Tomb Hike", "Lake Kivu Sunset"],
        hotel: "4★ Volcanoes Lodge",
        inclusions: ["4 Nights Lodge Stay", "All Meals", "Gorilla Trekking Permit", "Park Ranger & 4x4 Transfers"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Kigali to Volcanoes National Park", desc: "Scenic drive through Rwanda's thousand hills." },
          { day: "Day 2", title: "Mountain Gorilla Trekking", desc: "Guided trek to spend an hour with a habituated gorilla family." },
          { day: "Day 3", title: "Golden Monkey Tracking", desc: "Bamboo forest trek tracking rare golden monkeys." },
          { day: "Day 4", title: "Lake Kivu Excursion", desc: "Relax by the lakeshore, optional boat cruise at sunset." },
          { day: "Day 5", title: "Kigali Departure", desc: "Drive back to Kigali for onward flight." }
        ]
      },
      {
        id: "europe-norway-safari",
        title: "Norway — Svalbard Arctic Wildlife",
        duration: "6 Days / 5 Nights",
        price: "₹1,45,000",
        priceNum: 145000,
        perPerson: true,
        tag: "Polar Expedition",
        image: "assets/packages-images/safari-norway-real.jpg",
        rating: "4.9",
        reviewsCount: 58,
        highlights: ["Svalbard Polar Bear Spotting", "Arctic Fjord Zodiac Cruise", "Midnight Sun Wildlife Watch", "Walrus Colony Landing"],
        hotel: "5★ Ice-Class Expedition Ship Stateroom",
        inclusions: ["5 Nights Expedition Ship Cabin", "All Meals", "Daily Zodiac Landings", "Polar Naturalist Guides"],
        exclusions: ["International Flights to Longyearbyen"],
        itinerary: [
          { day: "Day 1", title: "Longyearbyen Embarkation", desc: "Board the expedition ship, sail into the Arctic fjords." },
          { day: "Day 2", title: "Arctic Fjord Zodiac Cruise", desc: "Search for polar bears along the pack ice edge." },
          { day: "Day 3", title: "Walrus Colony Landing", desc: "Zodiac landing to observe a resting walrus colony." },
          { day: "Day 4", title: "Midnight Sun Wildlife Watch", desc: "Late-night deck watch for polar bears under the midnight sun." },
          { day: "Day 5", title: "Glacier Front Cruising", desc: "Sail past calving glaciers, spot Arctic foxes onshore." },
          { day: "Day 6", title: "Longyearbyen Disembarkation", desc: "Disembark and transfer to airport." }
        ]
      },
      {
        id: "centralamerica-costarica-safari",
        title: "Costa Rica — Rainforest Wildlife Safari",
        duration: "5 Days / 4 Nights",
        price: "₹59,000",
        priceNum: 59000,
        perPerson: true,
        tag: "Rainforest Safari",
        image: "https://images.unsplash.com/photo-1623385521692-4a591e66619e?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 84,
        highlights: ["Corcovado National Park Trekking", "Sloth & Toucan Spotting", "Arenal Volcano Hanging Bridges", "Night Rainforest Walk"],
        hotel: "4★ Rainforest Eco Lodge",
        inclusions: ["4 Nights Eco Lodge Stay", "Daily Breakfast & Dinner", "Guided Park Treks", "National Park Entry Fees"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "San José to Arenal", desc: "Drive to the volcano region, evening hot springs soak." },
          { day: "Day 2", title: "Arenal Hanging Bridges", desc: "Canopy-level rainforest walk across suspension bridges." },
          { day: "Day 3", title: "Fly to Corcovado National Park", desc: "Transfer to the Osa Peninsula's dense rainforest reserve." },
          { day: "Day 4", title: "Corcovado Wildlife Trek", desc: "Guided trek spotting sloths, toucans, and scarlet macaws." },
          { day: "Day 5", title: "San José Departure", desc: "Fly back to San José for onward flight." }
        ]
      },
      {
        id: "asia-srilanka-leopard-safari",
        title: "Asia — Sri Lanka Leopard & Elephant Safari",
        duration: "5 Days / 4 Nights",
        price: "₹18,500",
        priceNum: 18500,
        perPerson: true,
        tag: "Leopard Trail",
        image: "assets/packages-images/safari-asia-srilanka.jpg",
        rating: "4.8",
        reviewsCount: 190,
        highlights: ["Yala Block 1 Leopard Tracking", "Udawalawe Elephant Transit Home", "Galle Dutch Fort Heritage", "Mirissa Sunset"],
        hotel: "4★ Jungle Resort in Yala",
        inclusions: ["4 Nights Resort Stay", "Daily Breakfast & Dinner", "Open Jeep Safaris in Yala & Udawalawe", "Colombo Transfers"],
        exclusions: ["Airfare & Visa"],
        itinerary: [
          { day: "Day 1", title: "Colombo to Udawalawe", desc: "Jeep safari tracking wild elephant herds." },
          { day: "Day 2", title: "Elephant Transit & Yala", desc: "Visit elephant feeding hour, transfer to Yala." },
          { day: "Day 3", title: "Yala Dawn & Dusk Safaris", desc: "Track Sri Lankan leopards and sloth bears." },
          { day: "Day 4", title: "Galle Fort & Coastal Road", desc: "Tour UNESCO Galle Fort and Mirissa coastline." },
          { day: "Day 5", title: "Colombo Shopping & Flight", desc: "City tour and airport transfer." }
        ]
      },
      {
        id: "asia-india-tiger-safari",
        title: "Asia — India Royal Tiger & Rhino Reserve",
        duration: "5 Days / 4 Nights",
        price: "₹17,500",
        priceNum: 17500,
        perPerson: true,
        tag: "Tiger Trail",
        image: "assets/packages-images/safari-asia-india.jpg",
        rating: "4.9",
        reviewsCount: 220,
        highlights: ["Ranthambore Gypsy Safaris", "Kaziranga One-Horned Rhino Safari", "Chambal Gharial Boat Safari", "Jaipur Pink City"],
        hotel: "4★ Heritage Jungle Resort",
        inclusions: ["4 Nights Heritage Stay", "All Meals", "Core Zone Gypsy Safaris", "Naturalist Passes"],
        exclusions: ["Train/Airfare"],
        itinerary: [
          { day: "Day 1", title: "Jaipur to Ranthambore Reserve", desc: "Drive to tiger reserve, evening nature walk." },
          { day: "Day 2", title: "Core Zone Tiger Safaris", desc: "Two Gypsy game drives tracking Bengal Tigers." },
          { day: "Day 3", title: "Chambal River Boat Safari", desc: "Spot gharial crocodiles and rare river dolphins." },
          { day: "Day 4", title: "Jaipur Pink City Sightseeing", desc: "Visit Amber Fort and Hawa Mahal." },
          { day: "Day 5", title: "Departure Jaipur", desc: "Handicraft shopping and airport drop." }
        ]
      },
      {
        id: "southamerica-brazil-pantanal-safari",
        title: "South America — Brazil Pantanal Jaguar Expedition",
        duration: "6 Days / 5 Nights",
        price: "₹56,000",
        priceNum: 56000,
        perPerson: true,
        tag: "Jaguar Safari",
        image: "assets/packages-images/safari-southamerica-brazil.jpg",
        rating: "5.0",
        reviewsCount: 165,
        highlights: ["Pantanal River Jaguar Boat Safari", "Giant Otter Tracking", "Caiman Night Safari", "Amazonian Flora Tour"],
        hotel: "5★ Rainforest Floating Eco Lodge",
        inclusions: ["5 Nights Eco Lodge Stay", "Full Board Chef Meals", "Boat Safaris & Guided Walks", "Cuiabá Airport Transfers"],
        exclusions: ["International Airfare"],
        itinerary: [
          { day: "Day 1", title: "Cuiabá to Pantanal Lodge", desc: "Drive into Pantanal wetlands. Evening caiman night drive." },
          { day: "Day 2", title: "Porto Jofre Jaguar Boat Safari", desc: "Full day boat safari tracking wild jaguars along riverbanks." },
          { day: "Day 3", title: "Giant Otters & Hyacinth Macaws", desc: "Spot giant river otters, macaws, and tapirs." },
          { day: "Day 4", title: "Amazonian Rainforest Walk", desc: "Guided botanical and primate trekking in rainforest canopy." },
          { day: "Day 5", title: "Horseback & Waterland Safari", desc: "Traditional Pantanal horseback safari through wetlands." },
          { day: "Day 6", title: "Cuiabá Departure", desc: "Breakfast, transfer to airport." }
        ]
      },
      {
        id: "northamerica-alaska-grizzly-safari",
        title: "North America — Alaska & Yellowstone Grizzly Safari",
        duration: "6 Days / 5 Nights",
        price: "₹64,000",
        priceNum: 64000,
        perPerson: true,
        tag: "Grizzly & Wolves",
        image: "assets/packages-images/safari-northamerica-alaska.jpg",
        rating: "4.9",
        reviewsCount: 150,
        highlights: ["Katmai Bear Salmon Fishing", "Yellowstone Geysers & Wolf Packs", "Denali Wilderness Drive", "Glacier Bay Cruise"],
        hotel: "5★ Wilderness Timber Lodge",
        inclusions: ["5 Nights Wilderness Lodge Stay", "All Meals", "Bush Plane Flight & Park Passes", "Bear Naturalist Guide"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Anchorage to Katmai Wilderness", desc: "Floatplane arrival to Katmai bear viewing lodge." },
          { day: "Day 2", title: "Brooks Falls Grizzly Bear Viewing", desc: "Watch brown bears catch salmon leaping at Brooks Falls." },
          { day: "Day 3", title: "Fly to Yellowstone National Park", desc: "Transfer to Lamar Valley for wolf pack tracking." },
          { day: "Day 4", title: "Old Faithful Geyser & Bison Herds", desc: "Tour geysers, hot springs, and roaming bison herds." },
          { day: "Day 5", title: "Denali Tundra Wildlife Tour", desc: "Spot moose, caribou, and Dall sheep under Mt. Denali." },
          { day: "Day 6", title: "Bozeman/Anchorage Departure", desc: "Breakfast, transfer to airport." }
        ]
      },
      {
        id: "australia-outback-kakadu-safari",
        title: "Australia & Oceania — Outback Kakadu Crocodile Safari",
        duration: "5 Days / 4 Nights",
        price: "₹45,000",
        priceNum: 45000,
        perPerson: true,
        tag: "Outback Safari",
        image: "assets/packages-images/safari-australia-kakadu.jpg",
        rating: "4.8",
        reviewsCount: 140,
        highlights: ["Yellow Water Billabong Cruise", "Saltwater Crocodile Spotting", "Ubirr Rock Aboriginal Art", "Litchfield Waterfalls"],
        hotel: "4★ Outback Bush Resort",
        inclusions: ["4 Nights Bush Resort Stay", "Daily Meals", "4x4 Outback Safaris & Billabong Cruises", "Darwin Airport Transfers"],
        exclusions: ["Airfare"],
        itinerary: [
          { day: "Day 1", title: "Darwin to Kakadu National Park", desc: "Drive to Kakadu. Sunset Yellow Water Billabong cruise." },
          { day: "Day 2", title: "Saltwater Crocodiles & Wildlife", desc: "Spot 5-meter crocs, jabirus, and wallabies." },
          { day: "Day 3", title: "Ubirr & Nourlangie Rock Art", desc: "Explore 20,000-year-old rock art and Arnhem Land views." },
          { day: "Day 4", title: "Litchfield Swimming Waterfalls", desc: "Swim at Florence Falls and Buley Rockhole." },
          { day: "Day 5", title: "Darwin Departure", desc: "Return drive to Darwin airport." }
        ]
      },
      {
        id: "antarctica-penguin-polar-safari",
        title: "Antarctica — Emperor Penguin & Polar Wildlife Safari",
        duration: "8 Days / 7 Nights",
        price: "₹1,20,000",
        priceNum: 120000,
        perPerson: true,
        tag: "Polar Expedition",
        image: "assets/packages-images/safari-antarctica-penguins.jpg",
        rating: "5.0",
        reviewsCount: 130,
        highlights: ["Emperor & Gentoo Penguin Colonies", "South Georgia Elephant Seals", "Zodiac Iceberg Cruises", "Orca & Humpback Whale Spotting"],
        hotel: "5★ Ice-Class Expedition Ship Stateroom",
        inclusions: ["7 Nights Luxury Expedition Ship Cabin", "All Meals & High Teas", "Daily Zodiac Landings & Polar Parka", "Marine Biologist Guides"],
        exclusions: ["International Flights to Ushuaia"],
        itinerary: [
          { day: "Day 1", title: "Ushuaia Board Expedition Ship", desc: "Embark vessel, sail down Beagle Channel." },
          { day: "Day 2", title: "Cross Drake Passage", desc: "Spot wandering albatrosses and petrels." },
          { day: "Day 3", title: "South Shetland Islands Landing", desc: "Zodiac landing among Chinstrap penguins." },
          { day: "Day 4", title: "Antarctic Peninsula Iceberg Bay", desc: "Cruise through iceberg labyrinths with humpback whales." },
          { day: "Day 5", title: "Emperor & Gentoo Penguin Colony", desc: "Walk among thousands of nesting penguins." },
          { day: "Day 6", title: "Elephant Seal & Leopard Seal Spotting", desc: "Observe massive elephant seals on ice floes." },
          { day: "Day 7", title: "Return Voyage North", desc: "Recap lectures by polar naturalists." },
          { day: "Day 8", title: "Ushuaia Disembarkation", desc: "Disembark and airport transfer." }
        ]
      }
    ]
  },
  "heritage": {
    id: "heritage",
    title: "Cultural & Heritage Wonders",
    category: "Culture",
    banner: "assets/packages-images/heritage-europe-paris.jpg",
    description: "Journey through iconic global landmarks, ancient civilizations, timeless architecture, and rich world heritage.",
    packages: [
      {
        id: "heritage-europe-paris-rome",
        title: "France & Italy — Paris, Venice & Rome Wonders",
        duration: "7 Days / 6 Nights",
        price: "₹72,000",
        priceNum: 72000,
        perPerson: true,
        tag: "European Heritage",
        image: "assets/packages-images/heritage-europe-paris.jpg",
        rating: "4.9",
        reviewsCount: 310,
        highlights: ["Eiffel Tower Summit Pass", "Louvre Museum Guided Tour", "Venice Grand Canal Gondola", "Rome Colosseum Skip-the-line"],
        hotel: "4★ / 5★ Central Boutique Hotels",
        inclusions: ["6 Nights Boutique Hotel Stay", "Daily Continental Breakfast", "High-speed TGV & Eurostar Rail Passes", "All Monument Entry Tickets"],
        exclusions: ["International Airfare & Schengen Visa"],
        itinerary: [
          { day: "Day 1", title: "Arrival Paris France", desc: "Transfer to city hotel. Evening Seine River illumination cruise." },
          { day: "Day 2", title: "Eiffel Tower & Louvre Museum", desc: "Ascend Eiffel Tower summit. Guided tour of Louvre masterpieces." },
          { day: "Day 3", title: "High-Speed Train to Venice", desc: "Scenic rail across Alps into Venice. Romantic sunset gondola ride." },
          { day: "Day 4", title: "St. Mark's Square & Murano Glass", desc: "Private boat tour to Murano and Burano colorful islands." },
          { day: "Day 5", title: "Train to Eternal City Rome", desc: "Arrival in Rome. Sunset walk through Trevi Fountain and Spanish Steps." },
          { day: "Day 6", title: "Colosseum & Vatican Museums", desc: "Skip-the-line tour of Colosseum floor and Sistine Chapel." },
          { day: "Day 7", title: "Rome Departure", desc: "Breakfast, transfer to Rome Fiumicino Airport." }
        ]
      },
      {
        id: "heritage-japan-kyoto-tokyo",
        title: "Japan — Kyoto Shrines & Tokyo Lights Trail",
        duration: "7 Days / 6 Nights",
        price: "₹85,000",
        priceNum: 85000,
        perPerson: true,
        tag: "Cultural Wonders",
        image: "assets/packages-images/heritage-japan-kyoto.jpg",
        rating: "5.0",
        reviewsCount: 260,
        highlights: ["Fushimi Inari Red Torii Gates", "Kinkaku-ji Golden Pavilion", "Shinkansen Bullet Train Experience", "Mount Fuji 5th Station"],
        hotel: "4★ Ryokan & Tokyo High-rise Hotel",
        inclusions: ["6 Nights Accommodation (includes 1 night traditional Ryokan with Onsen)", "7-Day JR Rail Pass", "Guided Shrine & Temple Tours", "Tokyo Airport Transfers"],
        exclusions: ["Flights & Japan Visa"],
        itinerary: [
          { day: "Day 1", title: "Arrival Tokyo Narita/Haneda", desc: "Welcome to Tokyo. Transfer to Shinjuku hotel. Evening neon walk." },
          { day: "Day 2", title: "Tokyo City Landmarks & Asakusa", desc: "Visit Senso-ji Temple, Meiji Shrine, and Shibuya Crossing." },
          { day: "Day 3", title: "Mount Fuji & Lake Kawaguchiko", desc: "Full day excursion to Mt. Fuji 5th Station and Lake Kawaguchiko." },
          { day: "Day 4", title: "Shinkansen Bullet Train to Kyoto", desc: "Ride 300 km/h bullet train to Kyoto. Visit Gion Geisha district." },
          { day: "Day 5", title: "Kyoto Golden Pavilion & Arashiyama", desc: "Explore Kinkaku-ji and Arashiyama Bamboo Grove." },
          { day: "Day 6", title: "Fushimi Inari & Nara Deer Park", desc: "Hike through 10,000 red Torii gates. Feed friendly deer in Nara Park." },
          { day: "Day 7", title: "Kansai/Tokyo Departure", desc: "Breakfast, express train to airport." }
        ]
      },
      {
        id: "heritage-egypt-pyramids-nile",
        title: "Egypt — Giza Pyramids & Nile Luxury Cruise",
        duration: "6 Days / 5 Nights",
        price: "₹48,000",
        priceNum: 48000,
        perPerson: true,
        tag: "Ancient Pharaohs",
        image: "assets/packages-images/heritage-egypt-pyramids.jpg",
        rating: "4.8",
        reviewsCount: 195,
        highlights: ["Great Pyramid of Giza & Sphinx", "Egyptian Museum Tutankhamun Gold", "Luxor & Karnak Temple Complex", "Nile River Cruise Stateroom"],
        hotel: "5★ Nile Cruise Ship & Cairo Hotel",
        inclusions: ["2 Nights Cairo 5★ Hotel + 3 Nights 5★ Nile Cruise Ship", "Full Board Meals on Cruise", "Domestic Cairo-Luxor Flights", "Egyptologist Private Guide"],
        exclusions: ["International Flights & Visa"],
        itinerary: [
          { day: "Day 1", title: "Arrival Cairo Egypt", desc: "Greeting at Cairo Airport. Transfer to Pyramids view hotel." },
          { day: "Day 2", title: "Giza Pyramids & Sphinx", desc: "Guided exploration of Great Pyramids, Sphinx, and Papyrus institute." },
          { day: "Day 3", title: "Fly to Luxor & Board Nile Cruise", desc: "Flight to Luxor. Embark 5★ cruise ship. Visit Karnak Temple." },
          { day: "Day 4", title: "Valley of the Kings & Queen Hatshepsut", desc: "Explore ancient royal tombs in Valley of the Kings." },
          { day: "Day 5", title: "Edfu & Kom Ombo Temples", desc: "Sail up Nile visiting Horus Temple in Edfu and Kom Ombo." },
          { day: "Day 6", title: "Aswan Philae Temple & Flight Home", desc: "Visit Philae Island temple, flight back to Cairo for departure." }
        ]
      },
      {
        id: "heritage-switzerland-alps-express",
        title: "Switzerland — Alpine Peaks & Glacier Express",
        duration: "6 Days / 5 Nights",
        price: "₹92,000",
        priceNum: 92000,
        perPerson: true,
        tag: "Alpine Grandeur",
        image: "assets/packages-images/heritage-switzerland-alps.jpg",
        rating: "5.0",
        reviewsCount: 240,
        highlights: ["Jungfraujoch Top of Europe Train", "Glacier Express Panoramic Train", "Matterhorn Zermatt View", "Lake Lucerne Steamer Cruise"],
        hotel: "4★ Alpine Chalet & Resort Stays",
        inclusions: ["5 Nights Alpine Resort Stays", "Daily Swiss Buffet Breakfast", "Swiss Travel Pass Flex (Unlimited Trains & Boats)", "Jungfraujoch Rail Pass"],
        exclusions: ["Airfare"],
        itinerary: [
          { day: "Day 1", title: "Arrival Zurich to Lucerne", desc: "Scenic train to Lucerne. Lake Lucerne sunset steamer cruise." },
          { day: "Day 2", title: "Interlaken & Grindelwald", desc: "Explore Interlaken resort town between lakes Thun and Brienz." },
          { day: "Day 3", title: "Jungfraujoch Top of Europe", desc: "Cogwheel train to 3,454m Jungfraujoch ice palace." },
          { day: "Day 4", title: "Glacier Express to Zermatt", desc: "World's most famous slow panoramic train ride to Zermatt." },
          { day: "Day 5", title: "Matterhorn Glacier Paradise", desc: "Cable car up Matterhorn peak, views of Swiss-Italian Alps." },
          { day: "Day 6", title: "Return to Zurich Airport", desc: "Breakfast, direct train to Zurich Airport." }
        ]
      },
      {
        id: "heritage-dubai-desert-luxury",
        title: "UAE — Dubai Luxury Skyline & Desert Safari",
        duration: "5 Days / 4 Nights",
        price: "₹34,000",
        priceNum: 34000,
        perPerson: true,
        tag: "Modern & Desert",
        image: "assets/packages-images/heritage-dubai-desert.jpg",
        rating: "4.9",
        reviewsCount: 380,
        highlights: ["Burj Khalifa 124th Floor Ticket", "Red Dune Desert Safari with BBQ", "Dubai Marina Yacht Cruise", "Museum of the Future Pass"],
        hotel: "5★ City Hotel with Infinity Pool",
        inclusions: ["4 Nights 5★ Hotel Stay", "Daily Breakfast", "4x4 Desert Dune Bashing & BBQ Show", "Dubai Airport Pick & Drop"],
        exclusions: ["Flights & Visa"],
        itinerary: [
          { day: "Day 1", title: "Arrival Dubai UAE", desc: "Private transfer to 5★ hotel. Evening Dubai Mall fountain show." },
          { day: "Day 2", title: "Burj Khalifa & Modern City Tour", desc: "Ascend Burj Khalifa 124th floor. Photo stop at Burj Al Arab." },
          { day: "Day 3", title: "Red Dune Desert Safari & BBQ", desc: "Afternoon 4x4 dune bashing, camel rides, belly dance & BBQ dinner." },
          { day: "Day 4", title: "Museum of the Future & Marina Cruise", desc: "Tour futuristic museum, evening luxury Marina yacht cruise." },
          { day: "Day 5", title: "Gold Souk & Airport Drop", desc: "Traditional spice and gold souk shopping, transfer to airport." }
        ]
      },
      {
        id: "heritage-vietnam-halong-bay",
        title: "Vietnam — Halong Bay Cruise & Ancient Hoi An",
        duration: "6 Days / 5 Nights",
        price: "₹29,500",
        priceNum: 29500,
        perPerson: true,
        tag: "Indochina Charm",
        image: "assets/packages-images/heritage-vietnam-halong.jpg",
        rating: "4.9",
        reviewsCount: 220,
        highlights: ["Halong Bay Overnight Luxury Cruise", "Hanoi Old Quarter Street Food", "Hoi An Ancient Town Lanterns", "Bana Hills Golden Bridge"],
        hotel: "4★ Heritage Hotel & Cruise Cabin",
        inclusions: ["4 Nights Hotel + 1 Night 5★ Halong Bay Cruise Ship", "Full Board Meals on Cruise", "Hanoi to Da Nang Domestic Flight", "All Airport & Cruise Transfers"],
        exclusions: ["International Flights & Visa"],
        itinerary: [
          { day: "Day 1", title: "Arrival Hanoi Vietnam", desc: "Welcome to Hanoi. Rickshaw ride through French Quarter." },
          { day: "Day 2", title: "Hanoi to Halong Bay Cruise", desc: "Drive to Halong Bay. Board luxury wooden junk ship. Kayaking in limestone karst caves." },
          { day: "Day 3", title: "Halong Bay Sunrise to Da Nang", desc: "Tai Chi on deck. Transfer to Hanoi airport, fly to Da Nang." },
          { day: "Day 4", title: "Bana Hills Golden Giant Hands Bridge", desc: "Cable car up Bana Hills, walk across iconic Golden Hands Bridge." },
          { day: "Day 5", title: "Hoi An Ancient Town Lantern Festival", desc: "Explore preserved UNESCO Hoi An town, night lantern boat ride." },
          { day: "Day 6", title: "Da Nang Airport Departure", desc: "Breakfast, transfer to Da Nang International Airport." }
        ]
      }
    ]
  },
  "kenya": {
    id: "kenya",
    title: "Kenya Packages",
    category: "International",
    banner: "assets/images/kenya.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Kenya.",
    packages: [
      {
        id: "kenya-explorer",
        title: "Kenya — Nairobi & Amboseli Explorer",
        duration: "6 Days / 5 Nights",
        price: "₹58,000",
        priceNum: 58000,
        perPerson: true,
        tag: "City & Wildlife",
        image: "assets/images/kenya.jpg",
        rating: "4.8",
        reviewsCount: 75,
        highlights: ["Nairobi National Park Safari", "Giraffe Centre & Elephant Orphanage", "Amboseli Mt Kilimanjaro Views", "Maasai Cultural Village"],
        hotel: "4★ Nairobi City Hotel + Amboseli Tented Camp",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Nairobi & Amboseli Game Drives", "All Ground Transfers"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Nairobi", desc: "Welcome at Jomo Kenyatta Airport, transfer to hotel, evening at leisure." },
          { day: "Day 2", title: "Nairobi National Park & Giraffe Centre", desc: "Morning safari minutes from the city, afternoon at the Giraffe Centre and Elephant Orphanage." },
          { day: "Day 3", title: "Drive to Amboseli National Park", desc: "Scenic drive south with views of Mount Kilimanjaro on the horizon." },
          { day: "Day 4", title: "Amboseli Full Day Safari", desc: "Game drives beneath Africa's highest peak, tracking elephant herds." },
          { day: "Day 5", title: "Maasai Village Visit & Return to Nairobi", desc: "Cultural visit to a local Maasai village before the drive back." },
          { day: "Day 6", title: "Nairobi Departure", desc: "Breakfast at hotel, transfer to airport for your flight home." }
        ]
      }
    ]
  },
  "tanzania": {
    id: "tanzania",
    title: "Tanzania Packages",
    category: "International",
    banner: "assets/images/tanzania.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Tanzania.",
    packages: [
      {
        id: "tanzania-explorer",
        title: "Tanzania — Zanzibar & Dar es Salaam Beach Escape",
        duration: "6 Days / 5 Nights",
        price: "₹52,000",
        priceNum: 52000,
        perPerson: true,
        tag: "Island Escape",
        image: "assets/images/tanzania.jpg",
        rating: "4.8",
        reviewsCount: 84,
        highlights: ["Stone Town UNESCO Old Town", "Spice Farm Tour", "Nakupenda Sandbank", "Prison Island Giant Tortoises"],
        hotel: "4★ Zanzibar Beach Resort",
        inclusions: ["5 Nights Beach Resort Stay", "Daily Breakfast", "Stone Town & Spice Farm Tour", "Airport Transfers"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Zanzibar", desc: "Welcome at the airport, transfer to your beach resort." },
          { day: "Day 2", title: "Stone Town Heritage Walk & Spice Farm", desc: "Explore the UNESCO old town, then a fragrant spice plantation tour." },
          { day: "Day 3", title: "Prison Island Tortoise Sanctuary", desc: "Boat trip to Prison Island to see century-old giant tortoises and snorkel nearby reefs." },
          { day: "Day 4", title: "Nakupenda Sandbank Boat Trip", desc: "Sail to the white sandbank for swimming and a fresh seafood lunch." },
          { day: "Day 5", title: "Beach Day at Nungwi", desc: "Relax on Zanzibar's famous northern beaches." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "rwanda": {
    id: "rwanda",
    title: "Rwanda Packages",
    category: "International",
    banner: "assets/images/rwanda.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Rwanda.",
    packages: [
      {
        id: "rwanda-explorer",
        title: "Rwanda — Kigali & Lake Kivu Discovery",
        duration: "5 Days / 4 Nights",
        price: "₹62,000",
        priceNum: 62000,
        perPerson: true,
        tag: "City & Lakeside",
        image: "assets/images/rwanda.jpg",
        rating: "4.8",
        reviewsCount: 78,
        highlights: ["Kigali Genocide Memorial", "Lake Kivu Boat Cruise", "Nyamirambo Walking Tour", "Coffee Plantation Visit"],
        hotel: "4★ Kigali City Hotel + Lakeside Lodge",
        inclusions: ["4 Nights Accommodation", "Daily Breakfast", "Lake Kivu Boat Cruise", "All Ground Transfers"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Kigali", desc: "Welcome at Kigali International Airport, transfer to hotel." },
          { day: "Day 2", title: "Kigali City & Genocide Memorial Tour", desc: "A moving, respectful visit to the memorial followed by a Nyamirambo walking tour." },
          { day: "Day 3", title: "Drive to Lake Kivu", desc: "Scenic drive to the lakeshore, sunset boat cruise." },
          { day: "Day 4", title: "Coffee Plantation & Local Market Visit", desc: "Tour a Rwandan coffee estate and browse the local market." },
          { day: "Day 5", title: "Departure", desc: "Breakfast, drive back to Kigali for your flight home." }
        ]
      }
    ]
  },
  "uganda": {
    id: "uganda",
    title: "Uganda Packages",
    category: "International",
    banner: "assets/images/uganda.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Uganda.",
    packages: [
      {
        id: "uganda-explorer",
        title: "Uganda — Kampala & Jinja Source of the Nile",
        duration: "5 Days / 4 Nights",
        price: "₹49,000",
        priceNum: 49000,
        perPerson: true,
        tag: "Adventure",
        image: "assets/images/uganda.jpg",
        rating: "4.8",
        reviewsCount: 78,
        highlights: ["Kampala City Tour", "Jinja Source of the Nile Boat Trip", "Bujagali Falls", "Nile White-Water Rafting"],
        hotel: "4★ Kampala Hotel + Nile Riverside Lodge",
        inclusions: ["4 Nights Accommodation", "Daily Breakfast", "Source of the Nile Boat Trip", "All Ground Transfers"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Kampala", desc: "Welcome at Entebbe Airport, transfer to Kampala." },
          { day: "Day 2", title: "Kampala City Tour & Uganda Museum", desc: "Explore the capital's markets, museum, and hilltop viewpoints." },
          { day: "Day 3", title: "Drive to Jinja, Source of the Nile", desc: "Boat trip to the exact point where the Nile begins its journey." },
          { day: "Day 4", title: "Nile White-Water Rafting & Bujagali Falls", desc: "Optional rafting on the Nile's rapids or a gentler visit to Bujagali Falls." },
          { day: "Day 5", title: "Departure", desc: "Breakfast, drive back to Entebbe for your flight home." }
        ]
      }
    ]
  },
  "zimbabwe": {
    id: "zimbabwe",
    title: "Zimbabwe Packages",
    category: "International",
    banner: "assets/images/zimbabwe.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Zimbabwe.",
    packages: [
      {
        id: "zimbabwe-explorer",
        title: "Zimbabwe — Harare & Great Zimbabwe Ruins",
        duration: "5 Days / 4 Nights",
        price: "₹47,000",
        priceNum: 47000,
        perPerson: true,
        tag: "Heritage",
        image: "assets/images/zimbabwe.jpg",
        rating: "4.8",
        reviewsCount: 84,
        highlights: ["Great Zimbabwe Ruins UNESCO Site", "Lake Mutirikwi Boat Cruise", "Harare Botanical Gardens", "Mbare Market"],
        hotel: "4★ Harare Hotel",
        inclusions: ["4 Nights Accommodation", "Daily Breakfast", "Great Zimbabwe Ruins Guided Tour", "All Ground Transfers"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Harare", desc: "Welcome at Robert Gabriel Mugabe Airport, transfer to hotel." },
          { day: "Day 2", title: "Harare City Tour & Botanical Gardens", desc: "Visit the National Botanical Gardens and Mbare Market." },
          { day: "Day 3", title: "Drive to Great Zimbabwe Ruins", desc: "Guided tour of the UNESCO-listed stone-walled ruins." },
          { day: "Day 4", title: "Lake Mutirikwi Boat Cruise", desc: "Relaxed cruise on the lake bordering the ruins." },
          { day: "Day 5", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "madagascar": {
    id: "madagascar",
    title: "Madagascar Packages",
    category: "International",
    banner: "assets/packages-images/safari-madagascar-baobab.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Madagascar.",
    packages: [
      {
        id: "madagascar-explorer",
        title: "Madagascar — Antananarivo & Nosy Be Island",
        duration: "6 Days / 5 Nights",
        price: "₹56,000",
        priceNum: 56000,
        perPerson: true,
        tag: "City & Beach",
        image: "assets/packages-images/safari-madagascar-baobab.jpg",
        rating: "4.8",
        reviewsCount: 90,
        highlights: ["Royal Hill of Ambohimanga", "Andasibe Lemur Reserve", "Nosy Be Beaches", "Sunset Dhow Cruise"],
        hotel: "4★ City Hotel + Nosy Be Beach Resort",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Andasibe Reserve Guided Trek", "Domestic Flight to Nosy Be"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Antananarivo", desc: "Welcome at the airport, transfer to your city hotel." },
          { day: "Day 2", title: "Royal Hill of Ambohimanga & City Tour", desc: "Visit the UNESCO royal hill and explore the capital." },
          { day: "Day 3", title: "Andasibe Reserve Lemur Trek", desc: "Guided walk tracking the Indri, Madagascar's largest lemur." },
          { day: "Day 4", title: "Fly to Nosy Be Island", desc: "Short domestic flight to the island, check in to your beach resort." },
          { day: "Day 5", title: "Nosy Be Beach Day & Sunset Dhow Cruise", desc: "Relax on the beach, then a traditional dhow sailing cruise at sunset." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "spain": {
    id: "spain",
    title: "Spain Packages",
    category: "International",
    banner: "assets/images/spain.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Spain.",
    packages: [
      {
        id: "spain-explorer",
        title: "Spain — Madrid & Barcelona Highlights",
        duration: "6 Days / 5 Nights",
        price: "₹68,000",
        priceNum: 68000,
        perPerson: true,
        tag: "City & Culture",
        image: "assets/images/spain.jpg",
        rating: "4.8",
        reviewsCount: 75,
        highlights: ["Prado Museum", "Royal Palace of Madrid", "Sagrada Familia", "Park Guell"],
        hotel: "4★ City Center Hotels",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Madrid to Barcelona High-Speed Train", "City Tours as per Itinerary"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Madrid", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Madrid City Tour & Prado Museum", desc: "Explore the Prado's masterpieces and the historic city center." },
          { day: "Day 3", title: "Royal Palace & Retiro Park", desc: "Visit Spain's official Royal Palace and stroll the Retiro gardens." },
          { day: "Day 4", title: "High-Speed Train to Barcelona", desc: "Scenic rail journey, evening at leisure on Las Ramblas." },
          { day: "Day 5", title: "Sagrada Familia & Park Guell", desc: "A full day exploring Gaudi's iconic architecture." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "switzerland": {
    id: "switzerland",
    title: "Switzerland Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of Switzerland.",
    packages: [
      {
        id: "switzerland-explorer",
        title: "Switzerland — Zurich, Lucerne & Interlaken",
        duration: "6 Days / 5 Nights",
        price: "₹95,000",
        priceNum: 95000,
        perPerson: true,
        tag: "Alpine Scenery",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 93,
        highlights: ["Lucerne Chapel Bridge", "Mount Titlis Cable Car", "Interlaken Alpine Lakes", "Jungfraujoch (Optional)"],
        hotel: "4★ Alpine Hotels",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Mount Titlis Cable Car Ticket", "Rail Transfers Between Cities"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Zurich", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Zurich City Tour", desc: "Explore the Old Town and Lake Zurich promenade." },
          { day: "Day 3", title: "Lucerne & Mount Titlis", desc: "Visit the Chapel Bridge, then cable car up to the glacier peak of Mount Titlis." },
          { day: "Day 4", title: "Transfer to Interlaken", desc: "Scenic train ride between the twin lakes of Interlaken." },
          { day: "Day 5", title: "Interlaken Lakes & Jungfraujoch (Optional)", desc: "Free day for lake activities, or an optional trip to \"Top of Europe\"." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "france": {
    id: "france",
    title: "France Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of France.",
    packages: [
      {
        id: "france-explorer",
        title: "France — Paris & French Riviera",
        duration: "7 Days / 6 Nights",
        price: "₹98,000",
        priceNum: 98000,
        perPerson: true,
        tag: "Romance & Coast",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 78,
        highlights: ["Eiffel Tower & Seine River Cruise", "Louvre Museum", "Palace of Versailles", "Nice Riviera Coast"],
        hotel: "4★ Paris Hotel + Riviera Resort",
        inclusions: ["6 Nights Accommodation", "Daily Breakfast", "Seine River Cruise", "Paris to Nice High-Speed Train"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Paris", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Eiffel Tower & Seine River Cruise", desc: "Ascend the Eiffel Tower, then a relaxed evening cruise on the Seine." },
          { day: "Day 3", title: "Louvre Museum & Champs-Elysees", desc: "See the Mona Lisa, then stroll the Champs-Elysees to the Arc de Triomphe." },
          { day: "Day 4", title: "Palace of Versailles Day Trip", desc: "Full day exploring the opulent palace and gardens." },
          { day: "Day 5", title: "Train to Nice, French Riviera", desc: "High-speed rail south to the sun-drenched Cote d'Azur." },
          { day: "Day 6", title: "Nice Coastal Exploration", desc: "Explore the Promenade des Anglais and Old Town Nice." },
          { day: "Day 7", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "italy": {
    id: "italy",
    title: "Italy Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of Italy.",
    packages: [
      {
        id: "italy-explorer",
        title: "Italy — Rome, Florence & Venice",
        duration: "7 Days / 6 Nights",
        price: "₹92,000",
        priceNum: 92000,
        perPerson: true,
        tag: "Classic Italy",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 75,
        highlights: ["Colosseum & Roman Forum", "Vatican Museums & Sistine Chapel", "Florence Duomo", "Venice Gondola Ride"],
        hotel: "4★ Italian City Hotels",
        inclusions: ["6 Nights Accommodation", "Daily Breakfast", "Inter-city Train Tickets", "Colosseum Skip-the-Line Entry"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Rome", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Colosseum & Roman Forum", desc: "Guided tour of ancient Rome's most iconic ruins." },
          { day: "Day 3", title: "Vatican Museums & Sistine Chapel", desc: "Marvel at Michelangelo's ceiling and St. Peter's Basilica." },
          { day: "Day 4", title: "Train to Florence", desc: "Visit the Duomo and the medieval Ponte Vecchio bridge." },
          { day: "Day 5", title: "Train to Venice", desc: "Travel to the floating city, evening at leisure." },
          { day: "Day 6", title: "Venice Gondola Ride & St Mark's Square", desc: "A classic gondola glide through the canals." },
          { day: "Day 7", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "uk": {
    id: "uk",
    title: "United Kingdom Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of United Kingdom.",
    packages: [
      {
        id: "uk-explorer",
        title: "United Kingdom — London & Edinburgh",
        duration: "6 Days / 5 Nights",
        price: "₹88,000",
        priceNum: 88000,
        perPerson: true,
        tag: "City & Castles",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 66,
        highlights: ["Buckingham Palace & Westminster", "Tower of London", "Edinburgh Castle", "Royal Mile"],
        hotel: "4★ London & Edinburgh Hotels",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "London to Edinburgh Train", "Tower of London Entry"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival London", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Buckingham Palace & Westminster", desc: "See the Changing of the Guard and Big Ben." },
          { day: "Day 3", title: "Tower of London & Thames Cruise", desc: "Explore the historic fortress and cruise the Thames." },
          { day: "Day 4", title: "Train to Edinburgh", desc: "Scenic rail journey north to Scotland's capital." },
          { day: "Day 5", title: "Edinburgh Castle & Royal Mile", desc: "Tour the hilltop castle and walk the historic Royal Mile." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "greece": {
    id: "greece",
    title: "Greece Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of Greece.",
    packages: [
      {
        id: "greece-explorer",
        title: "Greece — Athens & Santorini",
        duration: "6 Days / 5 Nights",
        price: "₹75,000",
        priceNum: 75000,
        perPerson: true,
        tag: "Islands & History",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 78,
        highlights: ["Acropolis & Parthenon", "Santorini Caldera Sunset", "Oia Village", "Ferry Island Hopping"],
        hotel: "4★ Athens Hotel + Santorini Caldera Suite",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Athens to Santorini Ferry", "Acropolis Entry Ticket"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Athens", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Acropolis & Parthenon Tour", desc: "Guided tour of the ancient citadel overlooking the city." },
          { day: "Day 3", title: "Ferry to Santorini", desc: "Sail across the Aegean to the caldera island." },
          { day: "Day 4", title: "Oia Village & Caldera Sunset", desc: "Explore whitewashed streets and watch the famous sunset." },
          { day: "Day 5", title: "Santorini Beach Day", desc: "Relax on the island's unique volcanic-sand beaches." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "iceland": {
    id: "iceland",
    title: "Iceland Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of Iceland.",
    packages: [
      {
        id: "iceland-explorer",
        title: "Iceland — Reykjavik & Golden Circle",
        duration: "6 Days / 5 Nights",
        price: "₹1,10,000",
        priceNum: 110000,
        perPerson: true,
        tag: "Natural Wonders",
        image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 81,
        highlights: ["Blue Lagoon Geothermal Spa", "Golden Circle (Geysir & Gullfoss)", "South Coast Waterfalls", "Northern Lights (Seasonal)"],
        hotel: "4★ Reykjavik Hotel",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Blue Lagoon Entry Ticket", "Golden Circle Guided Tour"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Reykjavik", desc: "Welcome at Keflavik Airport, transfer to your hotel." },
          { day: "Day 2", title: "Blue Lagoon Geothermal Spa", desc: "Soak in the famous milky-blue geothermal waters." },
          { day: "Day 3", title: "Golden Circle Tour", desc: "Visit Thingvellir National Park, the Geysir hot springs, and Gullfoss waterfall." },
          { day: "Day 4", title: "South Coast Waterfalls", desc: "See Seljalandsfoss and Skogafoss, two of Iceland's most photographed falls." },
          { day: "Day 5", title: "Reykjavik City & Northern Lights Hunt", desc: "City sightseeing by day, aurora hunting after dark (season permitting)." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "norway": {
    id: "norway",
    title: "Norway Packages",
    category: "International",
    banner: "assets/packages-images/safari-norway-real.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Norway.",
    packages: [
      {
        id: "norway-explorer",
        title: "Norway — Oslo & Bergen Fjords",
        duration: "6 Days / 5 Nights",
        price: "₹1,05,000",
        priceNum: 105000,
        perPerson: true,
        tag: "Fjord Scenery",
        image: "assets/packages-images/safari-norway-real.jpg",
        rating: "4.8",
        reviewsCount: 78,
        highlights: ["Oslo Viking Ship Museum", "Flam Railway Scenic Journey", "Sognefjord Cruise", "Bergen Fish Market"],
        hotel: "4★ Oslo & Bergen Hotels",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Flam Railway Ticket", "Sognefjord Cruise"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Oslo", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Oslo City Tour & Viking Ship Museum", desc: "Explore the capital and its remarkable Viking-age vessels." },
          { day: "Day 3", title: "Flam Railway Scenic Journey", desc: "One of the world's most spectacular train rides through the mountains." },
          { day: "Day 4", title: "Sognefjord Cruise", desc: "Sail Norway's longest and deepest fjord." },
          { day: "Day 5", title: "Bergen City & Fish Market", desc: "Explore the colorful Bryggen wharf and the harborside market." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "sydney": {
    id: "sydney",
    title: "Sydney Packages",
    category: "International",
    banner: "assets/images/syndey.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Sydney.",
    packages: [
      {
        id: "sydney-explorer",
        title: "Sydney City Explorer",
        duration: "5 Days / 4 Nights",
        price: "₹85,000",
        priceNum: 85000,
        perPerson: true,
        tag: "Iconic City",
        image: "assets/images/syndey.jpg",
        rating: "4.8",
        reviewsCount: 78,
        highlights: ["Sydney Opera House", "Harbour Bridge Climb", "Bondi Beach", "Blue Mountains Day Trip"],
        hotel: "4★ Sydney Harbourside Hotel",
        inclusions: ["4 Nights Accommodation", "Daily Breakfast", "Blue Mountains Day Tour", "Harbour Cruise"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Sydney", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Opera House & Harbour Bridge", desc: "Tour the iconic Opera House and harbour cruise past the Bridge." },
          { day: "Day 3", title: "Bondi to Coogee Coastal Walk", desc: "Scenic clifftop walk along Sydney's famous beaches." },
          { day: "Day 4", title: "Blue Mountains Day Trip", desc: "Visit the Three Sisters rock formation and Scenic World." },
          { day: "Day 5", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "melbourne": {
    id: "melbourne",
    title: "Melbourne Packages",
    category: "International",
    banner: "assets/images/melbourne.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Melbourne.",
    packages: [
      {
        id: "melbourne-explorer",
        title: "Melbourne City & Great Ocean Road",
        duration: "5 Days / 4 Nights",
        price: "₹78,000",
        priceNum: 78000,
        perPerson: true,
        tag: "Coastal Drive",
        image: "assets/images/melbourne.jpg",
        rating: "4.8",
        reviewsCount: 87,
        highlights: ["Great Ocean Road & 12 Apostles", "Federation Square", "St Kilda Beach", "Yarra Valley Wine Tasting"],
        hotel: "4★ Melbourne City Hotel",
        inclusions: ["4 Nights Accommodation", "Daily Breakfast", "Great Ocean Road Day Tour", "Yarra Valley Wine Tasting"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Melbourne", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Melbourne City Laneways & Federation Square", desc: "Explore the city's famous street art laneways and cultural precinct." },
          { day: "Day 3", title: "Great Ocean Road & 12 Apostles", desc: "Full day scenic drive to the iconic limestone stacks." },
          { day: "Day 4", title: "Yarra Valley Wine Tasting", desc: "A relaxed day among the vineyards of Victoria's wine country." },
          { day: "Day 5", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "australia-country": {
    id: "australia-country",
    title: "Australia Packages",
    category: "International",
    banner: "assets/packages-images/safari-australia-croc.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Australia.",
    packages: [
      {
        id: "australia-country-explorer",
        title: "Australia — Great Barrier Reef & Uluru",
        duration: "7 Days / 6 Nights",
        price: "₹1,25,000",
        priceNum: 125000,
        perPerson: true,
        tag: "Reef & Outback",
        image: "assets/packages-images/safari-australia-croc.jpg",
        rating: "4.8",
        reviewsCount: 111,
        highlights: ["Great Barrier Reef Snorkeling", "Uluru Sunset Viewing", "Kata Tjuta Valley Walk", "Daintree Rainforest"],
        hotel: "4★ Cairns Resort + Outback Lodge",
        inclusions: ["6 Nights Accommodation", "Daily Breakfast", "Great Barrier Reef Cruise", "Uluru Sunset & Sunrise Tour"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Cairns", desc: "Welcome at the airport, transfer to your resort." },
          { day: "Day 2", title: "Great Barrier Reef Snorkeling Cruise", desc: "A full day snorkeling the world's largest coral reef system." },
          { day: "Day 3", title: "Daintree Rainforest Tour", desc: "Explore the world's oldest tropical rainforest." },
          { day: "Day 4", title: "Fly to Uluru (Ayers Rock)", desc: "Transfer to the Red Centre, evening at leisure." },
          { day: "Day 5", title: "Uluru Sunset & Sunrise Viewing", desc: "Witness the rock change color at dawn and dusk." },
          { day: "Day 6", title: "Kata Tjuta Valley of the Winds Walk", desc: "A guided walk through the dramatic domes of Kata Tjuta." },
          { day: "Day 7", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "new-zealand": {
    id: "new-zealand",
    title: "New Zealand Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of New Zealand.",
    packages: [
      {
        id: "new-zealand-explorer",
        title: "New Zealand — Auckland & Queenstown Adventure",
        duration: "6 Days / 5 Nights",
        price: "₹1,15,000",
        priceNum: 115000,
        perPerson: true,
        tag: "Adventure Capital",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 93,
        highlights: ["Auckland Sky Tower", "Hobbiton Movie Set", "Queenstown Adventure Sports", "Milford Sound Cruise"],
        hotel: "4★ Auckland & Queenstown Hotels",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Hobbiton Movie Set Entry", "Milford Sound Day Cruise"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Auckland", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Auckland City & Sky Tower", desc: "City sightseeing with views from the Sky Tower." },
          { day: "Day 3", title: "Hobbiton Movie Set Tour", desc: "Visit the real Shire from The Lord of the Rings trilogy." },
          { day: "Day 4", title: "Fly to Queenstown", desc: "Transfer to New Zealand's adventure capital, evening at leisure." },
          { day: "Day 5", title: "Milford Sound Day Cruise", desc: "Full day scenic cruise through the fiord's dramatic cliffs and waterfalls." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "fiji": {
    id: "fiji",
    title: "Fiji Packages",
    category: "International",
    banner: "assets/images/fiji.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Fiji.",
    packages: [
      {
        id: "fiji-explorer",
        title: "Fiji — Nadi & Island Resort Escape",
        duration: "5 Days / 4 Nights",
        price: "₹82,000",
        priceNum: 82000,
        perPerson: true,
        tag: "Island Resort",
        image: "assets/images/fiji.jpg",
        rating: "4.8",
        reviewsCount: 72,
        highlights: ["Sabeto Mud Pools & Hot Springs", "South Sea Island Cruise", "Coral Coast Snorkeling", "Traditional Kava Ceremony"],
        hotel: "4★ Overwater Bungalow Resort",
        inclusions: ["4 Nights Resort Stay", "Daily Breakfast", "South Sea Island Cruise", "Airport Transfers"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Nadi", desc: "Welcome at the airport, transfer to your resort." },
          { day: "Day 2", title: "Sabeto Mud Pools & Hot Springs", desc: "Relax in the natural volcanic mud pools and hot springs." },
          { day: "Day 3", title: "South Sea Island Cruise & Snorkeling", desc: "Boat trip to a private islet with snorkeling over coral gardens." },
          { day: "Day 4", title: "Coral Coast Beach Day & Kava Ceremony", desc: "Beach relaxation followed by a traditional Fijian kava ceremony." },
          { day: "Day 5", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "brazil": {
    id: "brazil",
    title: "Brazil Packages",
    category: "International",
    banner: "assets/images/brazil.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Brazil.",
    packages: [
      {
        id: "brazil-explorer",
        title: "Brazil — Rio de Janeiro & Iguazu Falls",
        duration: "6 Days / 5 Nights",
        price: "₹72,000",
        priceNum: 72000,
        perPerson: true,
        tag: "Icons & Waterfalls",
        image: "assets/images/brazil.jpg",
        rating: "4.8",
        reviewsCount: 78,
        highlights: ["Christ the Redeemer", "Sugarloaf Mountain", "Copacabana Beach", "Iguazu Falls"],
        hotel: "4★ Rio Beachfront Hotel + Iguazu Lodge",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Domestic Flight to Iguazu", "Sugarloaf Cable Car Ticket"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Rio de Janeiro", desc: "Welcome at the airport, transfer to your beachfront hotel." },
          { day: "Day 2", title: "Christ the Redeemer & Sugarloaf Mountain", desc: "Visit both of Rio's most iconic viewpoints in one day." },
          { day: "Day 3", title: "Copacabana & Ipanema Beach Day", desc: "Relax on Rio's legendary beaches." },
          { day: "Day 4", title: "Fly to Iguazu Falls", desc: "Domestic flight to one of the world's great natural wonders." },
          { day: "Day 5", title: "Iguazu Falls Brazilian & Argentine Side", desc: "Full day exploring the thundering falls from both viewpoints." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "peru": {
    id: "peru",
    title: "Peru Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of Peru.",
    packages: [
      {
        id: "peru-explorer",
        title: "Peru — Lima & Machu Picchu",
        duration: "6 Days / 5 Nights",
        price: "₹79,000",
        priceNum: 79000,
        perPerson: true,
        tag: "Inca Trail",
        image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 72,
        highlights: ["Machu Picchu Citadel", "Sacred Valley of the Incas", "Cusco Old Town", "Lima Colonial Center"],
        hotel: "4★ Lima & Cusco Hotels",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Machu Picchu Entry & Train Ticket", "Sacred Valley Guided Tour"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Lima", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Lima Colonial Center & Miraflores", desc: "Explore the historic center and the coastal Miraflores district." },
          { day: "Day 3", title: "Fly to Cusco, Sacred Valley Tour", desc: "Acclimatize and tour the Sacred Valley's Inca ruins and markets." },
          { day: "Day 4", title: "Train to Machu Picchu", desc: "Full day exploring the legendary lost citadel of the Incas." },
          { day: "Day 5", title: "Cusco City & San Pedro Market", desc: "Discover Cusco's cobblestone streets and vibrant local market." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "argentina": {
    id: "argentina",
    title: "Argentina Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of Argentina.",
    packages: [
      {
        id: "argentina-explorer",
        title: "Argentina — Buenos Aires & Patagonia",
        duration: "7 Days / 6 Nights",
        price: "₹99,000",
        priceNum: 99000,
        perPerson: true,
        tag: "Tango & Glaciers",
        image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 87,
        highlights: ["Buenos Aires Tango Show", "La Boca Caminito", "Perito Moreno Glacier", "El Calafate Lake District"],
        hotel: "4★ Buenos Aires Hotel + Patagonia Lodge",
        inclusions: ["6 Nights Accommodation", "Daily Breakfast", "Domestic Flight to El Calafate", "Perito Moreno Glacier Tour"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Buenos Aires", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "City Tour & La Boca Caminito", desc: "Explore the colorful La Boca neighborhood and city landmarks." },
          { day: "Day 3", title: "Tango Show & Dinner", desc: "An evening of Argentina's most famous dance and cuisine." },
          { day: "Day 4", title: "Fly to El Calafate", desc: "Domestic flight to Patagonia's gateway town." },
          { day: "Day 5", title: "Perito Moreno Glacier Full Day Tour", desc: "Walkways over one of the world's few advancing glaciers." },
          { day: "Day 6", title: "El Calafate Lake District", desc: "Explore the turquoise lakes of the Patagonian steppe." },
          { day: "Day 7", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "colombia": {
    id: "colombia",
    title: "Colombia Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of Colombia.",
    packages: [
      {
        id: "colombia-explorer",
        title: "Colombia — Bogota & Cartagena",
        duration: "6 Days / 5 Nights",
        price: "₹64,000",
        priceNum: 64000,
        perPerson: true,
        tag: "Colonial & Coast",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 84,
        highlights: ["Cartagena Walled City", "Bogota Gold Museum", "Monserrate Mountain", "Rosario Islands"],
        hotel: "4★ Bogota & Cartagena Hotels",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Domestic Flight to Cartagena", "Rosario Islands Boat Trip"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Bogota", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Bogota City Tour & Gold Museum", desc: "Explore the historic La Candelaria district and the famous Gold Museum." },
          { day: "Day 3", title: "Monserrate Mountain Cable Car", desc: "Ride up to the hilltop sanctuary overlooking the capital." },
          { day: "Day 4", title: "Fly to Cartagena, Walled City Tour", desc: "Explore the colorful colonial streets of the UNESCO old town." },
          { day: "Day 5", title: "Rosario Islands Boat Trip", desc: "Island-hop through the turquoise Caribbean archipelago." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "usa": {
    id: "usa",
    title: "United States (USA) Packages",
    category: "International",
    banner: "assets/packages-images/safari-alaska-grizzly.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of United States (USA).",
    packages: [
      {
        id: "usa-explorer",
        title: "USA — New York & Los Angeles",
        duration: "7 Days / 6 Nights",
        price: "₹1,45,000",
        priceNum: 145000,
        perPerson: true,
        tag: "Coast to Coast",
        image: "assets/packages-images/safari-alaska-grizzly.jpg",
        rating: "4.8",
        reviewsCount: 69,
        highlights: ["Statue of Liberty & Ellis Island", "Times Square & Central Park", "Hollywood Walk of Fame", "Santa Monica Pier"],
        hotel: "4★ NYC & LA Hotels",
        inclusions: ["6 Nights Accommodation", "Daily Breakfast", "Domestic Flight NYC to LA", "Statue of Liberty Ferry Ticket"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival New York", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "Statue of Liberty & Ellis Island", desc: "Ferry out to two of America's most iconic landmarks." },
          { day: "Day 3", title: "Times Square, Central Park & 5th Avenue", desc: "A full day exploring the heart of Manhattan." },
          { day: "Day 4", title: "Fly to Los Angeles", desc: "Domestic flight to the West Coast." },
          { day: "Day 5", title: "Hollywood & Universal Studios", desc: "Walk the Walk of Fame and spend the day at the studio theme park." },
          { day: "Day 6", title: "Santa Monica Pier & Venice Beach", desc: "Relax along LA's famous beachfront boardwalks." },
          { day: "Day 7", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "canada": {
    id: "canada",
    title: "Canada Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of Canada.",
    packages: [
      {
        id: "canada-explorer",
        title: "Canada — Toronto & Niagara Falls",
        duration: "5 Days / 4 Nights",
        price: "₹89,000",
        priceNum: 89000,
        perPerson: true,
        tag: "City & Falls",
        image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 78,
        highlights: ["CN Tower", "Niagara Falls Boat Cruise", "Toronto Islands", "Niagara-on-the-Lake Wine Country"],
        hotel: "4★ Toronto Hotel + Niagara View Resort",
        inclusions: ["4 Nights Accommodation", "Daily Breakfast", "Niagara Falls Boat Cruise", "CN Tower Entry Ticket"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Toronto", desc: "Welcome at the airport, transfer to your hotel." },
          { day: "Day 2", title: "CN Tower & Toronto City Tour", desc: "Panoramic views from one of the world's tallest towers." },
          { day: "Day 3", title: "Niagara Falls Boat Cruise", desc: "Get close to the thundering falls aboard the Hornblower cruise." },
          { day: "Day 4", title: "Niagara-on-the-Lake Wine Tasting", desc: "A relaxed day among Ontario's wine country vineyards." },
          { day: "Day 5", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "mexico": {
    id: "mexico",
    title: "Mexico Packages",
    category: "International",
    banner: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80",
    description: "Explore the amazing sights, sounds, and vibrant culture of Mexico.",
    packages: [
      {
        id: "mexico-explorer",
        title: "Mexico — Cancun & Mexico City",
        duration: "6 Days / 5 Nights",
        price: "₹67,000",
        priceNum: 67000,
        perPerson: true,
        tag: "Beach & Pyramids",
        image: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80",
        rating: "4.8",
        reviewsCount: 78,
        highlights: ["Chichen Itza Pyramids", "Cancun Beaches", "Xcaret Eco Park", "Teotihuacan Pyramids"],
        hotel: "4★ Cancun Beach Resort + Mexico City Hotel",
        inclusions: ["5 Nights Accommodation", "Daily Breakfast", "Chichen Itza Day Tour", "Domestic Flight to Mexico City"],
        exclusions: ["International Flights"],
        itinerary: [
          { day: "Day 1", title: "Arrival Cancun", desc: "Welcome at the airport, transfer to your beach resort." },
          { day: "Day 2", title: "Cancun Beach Day & Xcaret Eco Park", desc: "Relax on the beach and explore the eco-archaeological park." },
          { day: "Day 3", title: "Chichen Itza Pyramid Day Trip", desc: "Full day visiting one of the New Seven Wonders of the World." },
          { day: "Day 4", title: "Fly to Mexico City", desc: "Domestic flight to the historic capital." },
          { day: "Day 5", title: "Teotihuacan Pyramids & Historic Center", desc: "Climb the Pyramid of the Sun and explore the colonial old town." },
          { day: "Day 6", title: "Departure", desc: "Breakfast, transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "antarctic-peninsula": {
    id: "antarctic-peninsula",
    title: "Antarctic Peninsula Packages",
    category: "International",
    banner: "assets/images/antarctic-peninsula.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of Antarctic Peninsula.",
    packages: [
      {
        id: "antarctic-peninsula-explorer",
        title: "Antarctic Peninsula Cruise Expedition",
        duration: "8 Days / 7 Nights",
        price: "₹3,85,000",
        priceNum: 385000,
        perPerson: true,
        tag: "Polar Expedition",
        image: "assets/images/antarctic-peninsula.jpg",
        rating: "4.8",
        reviewsCount: 117,
        highlights: ["Drake Passage Crossing", "Zodiac Iceberg Cruising", "Penguin Colony Landings", "Humpback Whale Watching"],
        hotel: "5★ Polar Expedition Ship Cabin",
        inclusions: ["7 Nights Expedition Ship Cabin", "All Meals Onboard", "Daily Zodiac Landings", "Expert Polar Naturalist Guides"],
        exclusions: ["International Flights to Ushuaia"],
        itinerary: [
          { day: "Day 1", title: "Ushuaia Embarkation", desc: "Board your expedition ship at the world's southernmost city." },
          { day: "Day 2", title: "Drake Passage Crossing", desc: "Sail south across the legendary passage, seabird watching on deck." },
          { day: "Day 3", title: "Antarctic Peninsula — First Landing", desc: "Your first Zodiac landing on the White Continent." },
          { day: "Day 4", title: "Penguin Colony Exploration", desc: "Visit large Gentoo and Adelie penguin rookeries." },
          { day: "Day 5", title: "Whale Watching & Iceberg Cruising", desc: "Zodiac cruising among towering icebergs, watching for humpback whales." },
          { day: "Day 6", title: "Continued Peninsula Exploration", desc: "Further landings among glaciers and historic research stations." },
          { day: "Day 7", title: "Drake Passage Return Crossing", desc: "Sail back north across the Drake Passage." },
          { day: "Day 8", title: "Ushuaia Disembarkation", desc: "Disembark and transfer to the airport for your flight home." }
        ]
      }
    ]
  },
  "south-shetland": {
    id: "south-shetland",
    title: "South Shetland Islands Packages",
    category: "International",
    banner: "assets/images/south-shetland-islands.jpg",
    description: "Explore the amazing sights, sounds, and vibrant culture of South Shetland Islands.",
    packages: [
      {
        id: "south-shetland-explorer",
        title: "South Shetland Islands Polar Expedition",
        duration: "8 Days / 7 Nights",
        price: "₹3,65,000",
        priceNum: 365000,
        perPerson: true,
        tag: "Polar Expedition",
        image: "assets/images/south-shetland-islands.jpg",
        rating: "4.8",
        reviewsCount: 102,
        highlights: ["Deception Island Volcanic Caldera", "Fur Seal Colonies", "Chinstrap Penguin Rookeries", "Whalers Bay Historic Site"],
        hotel: "5★ Polar Expedition Ship Cabin",
        inclusions: ["7 Nights Expedition Ship Cabin", "All Meals Onboard", "Daily Zodiac Landings", "Expert Polar Naturalist Guides"],
        exclusions: ["International Flights to Ushuaia"],
        itinerary: [
          { day: "Day 1", title: "Ushuaia Embarkation", desc: "Board your expedition ship at the world's southernmost city." },
          { day: "Day 2", title: "Drake Passage Crossing", desc: "Sail south across the legendary passage, seabird watching on deck." },
          { day: "Day 3", title: "Deception Island Volcanic Landing", desc: "Step ashore inside an active volcanic caldera." },
          { day: "Day 4", title: "Fur Seal & Penguin Colony Zodiac Cruising", desc: "Cruise past colonies of fur seals and Chinstrap penguins." },
          { day: "Day 5", title: "Whalers Bay Historic Site", desc: "Explore the rusting remains of a historic whaling station." },
          { day: "Day 6", title: "Further Island Exploration", desc: "Continue landings among the South Shetland archipelago." },
          { day: "Day 7", title: "Drake Passage Return", desc: "Sail back north across the Drake Passage." },
          { day: "Day 8", title: "Ushuaia Disembarkation", desc: "Disembark and transfer to the airport for your flight home." }
        ]
      }
    ]
  }
};

export function getPackageById(packageId) {
  if (!packageId) return null;

  // 1. Search directly in all packages
  for (const catKey in destinationsData) {
    const categoryObj = destinationsData[catKey];
    const found = (categoryObj.packages || []).find(p => p.id === packageId);
    if (found) {
      return {
        ...found,
        categoryObj: categoryObj
      };
    }
  }

  // 2. Fallback: If packageId is a category key (e.g., "goa", "bali", "maldives"), return its featured package
  if (destinationsData[packageId] && destinationsData[packageId].packages && destinationsData[packageId].packages.length > 0) {
    const categoryObj = destinationsData[packageId];
    return {
      ...categoryObj.packages[0],
      categoryObj: categoryObj
    };
  }

  return null;
}

// ==========================================================================
// 7 OFFICIAL CONTINENTS DATASET & TOURIST PLACES MAPPING
// ==========================================================================
export const continentsData = {
  "asia": {
    id: "asia",
    name: "Asia",
    tagline: "Vibrant Cultures, Ancient Temples & Exotic Tropical Islands",
    description: "Immerse yourself in Asia's breathtaking diversity — from the pristine overwater bungalows of the Maldives and tropical beaches of Thailand & Bali, to futuristic skyline marvels in Dubai, Tokyo, and Singapore.",
    banner: "assets/packages-images/heritage-vietnam-halong.jpg",
    destinations: [
      { id: "thailand", name: "Thailand", tag: "Tropical Beaches", image: "assets/packages-images/thailand.jpg", packagesCount: 4, desc: "Phuket, Bangkok & Krabi Islands" },
      { id: "singapore", name: "Singapore", tag: "City Marvel", image: "assets/images/singapore.jpg", packagesCount: 3, desc: "Marina Bay Sands & Sentosa Island" },
      { id: "malaysia", name: "Malaysia", tag: "Rainforest & Skylines", image: "assets/images/malyasia.jpg", packagesCount: 3, desc: "Kuala Lumpur & Langkawi Island" },
      { id: "vietnam", name: "Vietnam", tag: "UNESCO Heritage", image: "assets/packages-images/heritage-vietnam-halong.jpg", packagesCount: 3, desc: "Halong Bay & Golden Hands Bridge" },
      { id: "japan", name: "Japan", tag: "Culture & Mount Fuji", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", packagesCount: 2, desc: "Tokyo, Kyoto & Mount Fuji" },
      { id: "srilanka", name: "Sri Lanka", tag: "Island Wonders", image: "assets/packages-images/safari-srilanka-leopard.jpg", packagesCount: 3, desc: "Kandy, Sigiriya & Ceylon Tea" },
      { id: "dubai", name: "Dubai (UAE)", tag: "Desert & Luxury", image: "assets/images/dubai.jpg", packagesCount: 4, desc: "Burj Khalifa & Desert Safaris" },
      { id: "bali", name: "Bali (Indonesia)", tag: "Island Paradise", image: "assets/packages-images/bali.jpg", packagesCount: 4, desc: "Ubud Rice Terraces & Beach Clubs" },
      { id: "andaman", name: "Andaman Islands", tag: "Coral Reefs", image: "assets/packages-images/Andaman.jpg", packagesCount: 4, desc: "Radhanagar Beach & Scuba Diving" },
      { id: "kerala", name: "Kerala (India)", tag: "Backwaters & Tea", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80", packagesCount: 3, desc: "Munnar Hills & Alleppey Houseboats" },
      { id: "maldives", name: "Maldives", tag: "Luxury Water Villas", image: "assets/packages-images/maldives.jpg", packagesCount: 3, desc: "Private Island Resorts & Coral Lagoons" },
      { id: "turkey", name: "Turkey", tag: "East Meets West", image: "assets/images/turkey.jpg", packagesCount: 3, desc: "Cappadocia Hot Air Balloons & Istanbul" }
    ]
  },
  "africa": {
    id: "africa",
    name: "Africa",
    tagline: "Wildlife Safaris, Ancient Pyramids & Tropical Island Havens",
    description: "Embark on extraordinary African adventures — witness Big 5 wildlife on Serengeti & Masai Mara safaris, marvel at Egypt's ancient Pyramids, and unwind on crystal lagoons in Mauritius & Seychelles.",
    banner: "assets/packages-images/safari-africa-mara.jpg",
    destinations: [
      { id: "egypt", name: "Egypt", tag: "Ancient Wonders", image: "assets/images/egypt.jpg", packagesCount: 3, desc: "Giza Pyramids & Nile River Cruises" },
      { id: "south-africa", name: "South Africa", tag: "Big 5 Safari & Coast", image: "assets/packages-images/safari-africa-mara.jpg", packagesCount: 3, desc: "Cape Town & Kruger National Park" },
      { id: "kenya", name: "Kenya", tag: "Masai Mara Safari", image: "assets/images/kenya.jpg", packagesCount: 2, desc: "Great Wildebeest Migration Safaris" },
      { id: "tanzania", name: "Tanzania", tag: "Serengeti & Kilimanjaro", image: "assets/images/tanzania.jpg", packagesCount: 2, desc: "Serengeti Safaris & Mount Kilimanjaro" },
      { id: "rwanda", name: "Rwanda", tag: "Gorilla Trekking", image: "assets/images/rwanda.jpg", packagesCount: 1, desc: "Volcanoes National Park" },
      { id: "uganda", name: "Uganda", tag: "Pearl of Africa", image: "assets/images/uganda.jpg", packagesCount: 1, desc: "Bwindi Impenetrable Forest" },
      { id: "zimbabwe", name: "Zimbabwe", tag: "Victoria Falls", image: "assets/images/zimbabwe.jpg", packagesCount: 1, desc: "Victoria Falls & Zambezi River" },
      { id: "mauritius", name: "Mauritius", tag: "Tropical Lagoon", image: "assets/packages-images/mauritius.jpg", packagesCount: 3, desc: "Le Morne Beach & Chamarel Seven Colored Earth" },
      { id: "seychelles", name: "Seychelles", tag: "Granite Beaches", image: "assets/packages-images/seychelles.jpg", packagesCount: 2, desc: "Anse Source d'Argent & Mahe Island" },
      { id: "madagascar", name: "Madagascar", tag: "Unique Lemurs & Trees", image: "assets/packages-images/safari-madagascar-baobab.jpg", packagesCount: 2, desc: "Avenue of the Baobabs & Wildlife" }
    ]
  },
  "europe": {
    id: "europe",
    name: "Europe",
    tagline: "Historic Capitals, Alpine Peaks, Romantic Canals & Sunlit Coasts",
    description: "Experience timeless European romance — ascend the Swiss Alps, walk historic streets in Paris & Rome, cruise Venetian canals, and chase the Northern Lights in Scandinavia.",
    banner: "assets/packages-images/safari-norway-real.jpg",
    destinations: [
      { id: "spain", name: "Spain", tag: "Architecture & Passion", image: "assets/images/spain.jpg", packagesCount: 2, desc: "Barcelona Sagrada Familia & Madrid" },
      { id: "switzerland", name: "Switzerland", tag: "Alpine Wonderland", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80", packagesCount: 4, desc: "Interlaken, Lucerne & Jungfraujoch" },
      { id: "france", name: "France", tag: "Romance & Fashion", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", packagesCount: 3, desc: "Paris Eiffel Tower & French Riviera" },
      { id: "italy", name: "Italy", tag: "Art, Food & History", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80", packagesCount: 3, desc: "Rome Colosseum, Venice Canals & Amalfi" },
      { id: "uk", name: "United Kingdom", tag: "Royalty & Heritage", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80", packagesCount: 2, desc: "London Big Ben & Scottish Highlands" },
      { id: "greece", name: "Greece", tag: "Sunsets & Islands", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80", packagesCount: 3, desc: "Santorini Caldera & Athens Acropolis" },
      { id: "iceland", name: "Iceland", tag: "Fire & Ice", image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80", packagesCount: 2, desc: "Northern Lights, Geysers & Blue Lagoon" },
      { id: "norway", name: "Norway", tag: "Fjords & Midnight Sun", image: "assets/packages-images/safari-norway-real.jpg", packagesCount: 2, desc: "Geirangerfjord & Lofoten Islands" }
    ]
  },
  "australia": {
    id: "australia",
    name: "Australia & Oceania",
    tagline: "Great Barrier Reefs, Alpine Fjords & Tropical Island Paradises",
    description: "Explore Oceania's sun-drenched wonderlands — dive the Great Barrier Reef, witness Sydney's iconic harbor, explore New Zealand's fjords, and relax on Fijian coral beaches.",
    banner: "assets/packages-images/safari-australia-croc.jpg",
    destinations: [
      { id: "sydney", name: "Sydney", tag: "Opera House & Beaches", image: "assets/images/syndey.jpg", packagesCount: 1, desc: "Sydney Opera House & Bondi Beach" },
      { id: "melbourne", name: "Melbourne", tag: "Culture & Coast", image: "assets/images/melbourne.jpg", packagesCount: 1, desc: "Great Ocean Road & Yarra Valley" },
      { id: "australia-country", name: "Australia", tag: "Reef & Harbour", image: "assets/packages-images/safari-australia-croc.jpg", packagesCount: 3, desc: "Great Barrier Reef & Gold Coast" },
      { id: "new-zealand", name: "New Zealand", tag: "Fjords & Adventure", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80", packagesCount: 2, desc: "Milford Sound, Queenstown & Hobbiton" },
      { id: "fiji", name: "Fiji", tag: "Island Resorts", image: "assets/images/fiji.jpg", packagesCount: 2, desc: "Coral Lagoons & Private Bounty Islands" }
    ]
  },
  "south-america": {
    id: "south-america",
    name: "South America",
    tagline: "Ancient Civilizations, Amazon Rainforests & Passionate Cultures",
    description: "Uncover South America's enchanting treasures — stand atop Inca citadel Machu Picchu, feel the power of Iguaçu Falls, and immerse yourself in Rio de Janeiro's vibrant rhythms.",
    banner: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=85",
    destinations: [
      { id: "brazil", name: "Brazil", tag: "Amazon & Samba", image: "assets/images/brazil.jpg", packagesCount: 2, desc: "Rio Christ Redeemer & Amazon Rainforest" },
      { id: "peru", name: "Peru", tag: "Inca Empire", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80", packagesCount: 2, desc: "Machu Picchu, Cusco & Sacred Valley" },
      { id: "argentina", name: "Argentina", tag: "Tango & Glaciers", image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=800&q=80", packagesCount: 2, desc: "Buenos Aires & Perito Moreno Glacier" },
      { id: "colombia", name: "Colombia", tag: "Colonial Romance", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80", packagesCount: 1, desc: "Cartagena Walled City & Coffee Region" }
    ]
  },
  "north-america": {
    id: "north-america",
    name: "North America",
    tagline: "Iconic Wonders, Majestic National Parks & Cosmopolitan Skylines",
    description: "Discover North America's legendary landscapes — from the glitz of New York and Las Vegas to the natural splendor of the Grand Canyon, Niagara Falls, and Banff National Park.",
    banner: "assets/packages-images/safari-alaska-grizzly.jpg",
    destinations: [
      { id: "usa", name: "United States (USA)", tag: "Metropolis & Wonders", image: "assets/packages-images/safari-alaska-grizzly.jpg", packagesCount: 3, desc: "New York, Grand Canyon, Las Vegas & Hawaii" },
      { id: "canada", name: "Canada", tag: "Alpine Lakes & Fjords", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80", packagesCount: 2, desc: "Banff Rocky Mountains & Niagara Falls" },
      { id: "mexico", name: "Mexico", tag: "Caribbean & Mayans", image: "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=800&q=80", packagesCount: 2, desc: "Cancun Beaches & Chichen Itza Pyramids" }
    ]
  },
  "antarctica": {
    id: "antarctica",
    name: "Antarctica",
    tagline: "Polar Frontiers, Iceberg Fjords & Untouched Wilderness Expeditions",
    description: "Journey to the edge of the Earth — navigate the legendary Drake Passage, kayak alongside icebergs, and witness massive emperor penguin colonies in Antarctica.",
    banner: "assets/packages-images/safari-antarctica-penguins.jpg",
    destinations: [
      { id: "antarctic-peninsula", name: "Antarctic Peninsula", tag: "Icebergs & Wildlife", image: "assets/images/antarctic-peninsula.jpg", packagesCount: 1, desc: "Stunning Glaciers & Penguin Colonies" },
      { id: "south-shetland", name: "South Shetland Islands", tag: "Polar Expeditions", image: "assets/images/south-shetland-islands.jpg", packagesCount: 1, desc: "Volcanic Landscapes & Seals" }
    ]
  }
};

// ==========================================================================
// DYNAMICALLY GENERATE MISSING DESTINATIONS
// Ensures every country has a separate page without throwing errors
// ==========================================================================
Object.values(continentsData).forEach(continent => {
  continent.destinations.forEach(dest => {
    if (!destinationsData[dest.id]) {
      destinationsData[dest.id] = {
        id: dest.id,
        title: dest.name + " Packages",
        category: continent.name,
        banner: dest.image,
        description: dest.desc || "Explore the amazing sights, sounds, and vibrant culture of " + dest.name + ".",
        packages: [
          {
            id: dest.id + "-explorer",
            title: "Ultimate " + dest.name + " Explorer",
            duration: "7 Days / 6 Nights",
            price: "₹45,000",
            priceNum: 45000,
            perPerson: true,
            tag: "Best Value",
            image: dest.image,
            rating: "4.8",
            reviewsCount: Math.floor(Math.random() * 100) + 50,
            highlights: ["Guided City Tour", "Cultural Experiences", "Premium Accommodation"],
            hotel: "4★ Premium Hotels",
            inclusions: ["6 Nights Stay", "Daily Breakfast", "Sightseeing Tour", "Airport Transfers"],
            exclusions: ["Flights", "Visa", "Personal Expenses", "Travel Insurance"],
            itinerary: [
              { day: "Day 1", title: "Arrival", desc: "Welcome! Arrive at the airport and get a private transfer to your hotel. Evening at leisure." },
              { day: "Day 2-6", title: "Explore " + dest.name, desc: "Enjoy comprehensive guided tours, breathtaking scenery, and local cultural activities." },
              { day: "Day 7", title: "Departure", desc: "Breakfast at the hotel, check out, and transfer to the airport for your flight back home." }
            ]
          }
        ]
      };
    }
  });
});

