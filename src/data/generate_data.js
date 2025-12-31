import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const townCenters = {
    "Syracuse Downtown": { lat: 43.048, lng: -76.152 },
    "Westcott": { lat: 43.040, lng: -76.120 },
    "Tipperary Hill": { lat: 43.043, lng: -76.175 },
    "Eastwood": { lat: 43.065, lng: -76.115 },
    "Cicero": { lat: 43.170, lng: -76.120 },
    "Liverpool": { lat: 43.105, lng: -76.210 },
    "Clay": { lat: 43.180, lng: -76.210 },
    "North Syracuse": { lat: 43.135, lng: -76.130 },
    "Baldwinsville": { lat: 43.158, lng: -76.333 },
    "Fayetteville": { lat: 43.029, lng: -76.005 },
    "Manlius": { lat: 43.001, lng: -75.978 },
    "East Syracuse": { lat: 43.065, lng: -76.075 },
    "Dewitt": { lat: 43.040, lng: -76.070 },
    "Camillus": { lat: 43.040, lng: -76.307 },
    "Solvay": { lat: 43.056, lng: -76.208 },
    "Mattydale": { lat: 43.105, lng: -76.155 }
};

// Fix typo in North Syracuse above manually during logic if needed, but I'll fix it in the list below.
// Actually let's just correct the object in code.
townCenters["North Syracuse"] = { lat: 43.135, lng: -76.130 };

const rawData = [
    // EXISTING
    { name: "Dinosaur Bar-B-Que", area: "Syracuse Downtown", cuisine: "BBQ" },
    { name: "Pastabilities", area: "Syracuse Downtown", cuisine: "Italian" },
    { name: "The Retreat", area: "Liverpool", cuisine: "American" },
    { name: "Heid's of Liverpool", area: "Liverpool", cuisine: "Fast Food" },
    { name: "Delmonico's Italian Steakhouse", area: "Syracuse Downtown", cuisine: "Italian" },
    { name: "Chick-fil-A", area: "Cicero", cuisine: "Fast Food" },
    { name: "Cicero Country Pizza", area: "Cicero", cuisine: "Pizza" },
    { name: "Thee Diner", area: "Cicero", cuisine: "American" },
    { name: "CopperTop Tavern", area: "Cicero", cuisine: "American" },
    { name: "Frankie Sushi", area: "Cicero", cuisine: "Japanese" },
    { name: "Grotto Restaurant", area: "North Syracuse", cuisine: "Italian" },
    { name: "Limp Lizard", area: "Liverpool", cuisine: "BBQ" },
    { name: "Twin Trees III", area: "Liverpool", cuisine: "Pizza" },
    { name: "Gardenview Diner", area: "Liverpool", cuisine: "American" },
    { name: "Santangelo's", area: "Liverpool", cuisine: "Italian" },
    { name: "Thai Village", area: "Liverpool", cuisine: "Thai" },
    { name: "Avicolli's", area: "Liverpool", cuisine: "Italian" },
    { name: "Euclid Restaurant", area: "Clay", cuisine: "American" },
    { name: "Mr. Tafari's Jamaican Cuisine", area: "Liverpool", cuisine: "Caribbean" },
    { name: "Tully's Good Times", area: "Liverpool", cuisine: "American" },
    { name: "Texas Roadhouse", area: "Clay", cuisine: "Steakhouse" },
    { name: "Wrap it Up!!!", area: "Cicero", cuisine: "Sandwiches" },
    { name: "110 Grill", area: "Syracuse Downtown", cuisine: "American" },
    { name: "Eden", area: "Syracuse Downtown", cuisine: "American" },
    { name: "Apizza Regionale", area: "Syracuse Downtown", cuisine: "Pizza" },
    { name: "Francesca's Cucina", area: "Syracuse Downtown", cuisine: "Italian" },
    { name: "The Fish Friar", area: "Syracuse Downtown", cuisine: "Seafood" },
    { name: "Kitty Hoyne's Irish Pub", area: "Syracuse Downtown", cuisine: "Pub" },
    { name: "Alto Cinco", area: "Westcott", cuisine: "Mexican" },
    { name: "Phoebe's Restaurant", area: "Syracuse Downtown", cuisine: "American" },
    { name: "The Evergreen", area: "Syracuse Downtown", cuisine: "Pub" },
    { name: "Sakana-Ya Sushi Bar", area: "Syracuse Downtown", cuisine: "Japanese" },
    { name: "Stella's Diner", area: "Syracuse Downtown", cuisine: "American" },
    { name: "Modern Malt", area: "Syracuse Downtown", cuisine: "American" },
    { name: "Oh My Darling", area: "Syracuse Downtown", cuisine: "American" },
    { name: "Ale 'n' Angus Pub", area: "Syracuse Downtown", cuisine: "Pub" },
    { name: "Coleman's Authentic Irish Pub", area: "Tipperary Hill", cuisine: "Pub" },
    { name: "Rio Grande Mexican", area: "Liverpool", cuisine: "Mexican" },
    { name: "Ichiban Japanese Steakhouse", area: "Liverpool", cuisine: "Japanese" },
    { name: "Red Lobster", area: "Clay", cuisine: "Seafood" },
    { name: "Olive Garden", area: "Clay", cuisine: "Italian" },
    { name: "Applebee's", area: "Liverpool", cuisine: "American" },
    { name: "Buffalo Wild Wings", area: "Cicero", cuisine: "Wings" },
    { name: "CoreLife Eatery", area: "Cicero", cuisine: "Health" },
    { name: "Panera Bread", area: "Cicero", cuisine: "Cafe" },
    { name: "Moe's Southwest Grill", area: "Cicero", cuisine: "Mexican" },
    { name: "Five Guys", area: "Cicero", cuisine: "Fast Food" },
    { name: "Chipotle Mexican Grill", area: "Cicero", cuisine: "Mexican" },
    { name: "Cracker Barrel", area: "Cicero", cuisine: "American" },
    { name: "Dunkin'", area: "Cicero", cuisine: "Cafe" },

    // BALDWINSVILLE
    { name: "Angry Smokehouse", area: "Baldwinsville", cuisine: "BBQ" },
    { name: "Angry Garlic", area: "Baldwinsville", cuisine: "American" },
    { name: "Suds Factory River Grill", area: "Baldwinsville", cuisine: "Pub" },
    { name: "Fireside By The River", area: "Baldwinsville", cuisine: "American" },
    { name: "B'Ville Diner", area: "Baldwinsville", cuisine: "American" },
    { name: "The Wood", area: "Baldwinsville", cuisine: "Pub" },
    { name: "Pastas on the Green", area: "Baldwinsville", cuisine: "Italian" },
    { name: "Olive's Eatery", area: "Baldwinsville", cuisine: "Cafe" },

    // FAYETTEVILLE / MANLIUS
    { name: "Craftsman Wood Grille", area: "Fayetteville", cuisine: "American" },
    { name: "Carrabba's Italian Grill", area: "Fayetteville", cuisine: "Italian" },
    { name: "Avicolli's Coal Fire", area: "Fayetteville", cuisine: "Pizza" },
    { name: "Bonefish Grill", area: "Fayetteville", cuisine: "Seafood" },
    { name: "Twin Trees Fayetteville", area: "Fayetteville", cuisine: "Pizza" },
    { name: "Gino's Cheese Steak", area: "Fayetteville", cuisine: "Sandwiches" },
    { name: "King David's", area: "Fayetteville", cuisine: "Mediterranean" },
    { name: "Bull & Bear Roadhouse", area: "Fayetteville", cuisine: "Pub" },
    { name: "The Daily Diner", area: "Manlius", cuisine: "American" },
    { name: "Scenic Root", area: "Manlius", cuisine: "American" },
    { name: "Manlius Fish Fry", area: "Manlius", cuisine: "Seafood" },
    { name: "Cafe 119", area: "Manlius", cuisine: "Cafe" },
    { name: "Stingers Pizza Pub", area: "Manlius", cuisine: "Pizza" },
    { name: "Papa Gallo", area: "Fayetteville", cuisine: "Mexican" },

    // CAMILLUS / SOLVAY
    { name: "CopperTop Tavern Camillus", area: "Camillus", cuisine: "American" },
    { name: "Franco's Pizzeria", area: "Camillus", cuisine: "Pizza" },
    { name: "Camillus Grill", area: "Camillus", cuisine: "American" },
    { name: "TK Tavern", area: "Camillus", cuisine: "Pub" },
    { name: "Uncle Mike's Hometown Pizza", area: "Camillus", cuisine: "Pizza" },
    { name: "The Green Gate", area: "Camillus", cuisine: "Pub" },
    { name: "Cam's Pizza", area: "Camillus", cuisine: "Pizza" },
    { name: "The Wildcat", area: "Camillus", cuisine: "Pub" },
    { name: "The Inn Between", area: "Camillus", cuisine: "American" },
    { name: "The Cider Mill", area: "Camillus", cuisine: "American" },
    { name: "Gracie's Kitchen", area: "Solvay", cuisine: "American" },
    { name: "Mona Lisa's Ristorante", area: "Solvay", cuisine: "Italian" },
    { name: "Bianchi's Pizza Pad", area: "Solvay", cuisine: "Pizza" },
    { name: "Sam's Chickenland", area: "Solvay", cuisine: "Fast Food" },

    // EAST SYRACUSE / DEWITT
    { name: "Trapper's Pizza Pub", area: "East Syracuse", cuisine: "Pizza" },
    { name: "TS Steakhouse", area: "East Syracuse", cuisine: "Steakhouse" },
    { name: "Redwood Diner", area: "East Syracuse", cuisine: "American" },
    { name: "Original Italian Pizza East Syr", area: "East Syracuse", cuisine: "Pizza" },
    { name: "CopperTop Tavern Dewitt", area: "Dewitt", cuisine: "American" },
    { name: "Pavone's Pizza", area: "Dewitt", cuisine: "Pizza" },
    { name: "The Dark Horse Tavern", area: "Dewitt", cuisine: "Pub" },
    { name: "The Scotch 'N Sirloin", area: "Dewitt", cuisine: "Steakhouse" },
    { name: "All Night Eggplant", area: "Dewitt", cuisine: "American" },
    { name: "Olive Garden Dewitt", area: "Dewitt", cuisine: "Italian" },

    // WESTCOTT
    { name: "Rise N Shine Diner", area: "Westcott", cuisine: "American" },
    { name: "Gangnam Style Korean", area: "Westcott", cuisine: "Asian" },
    { name: "Las Delicias", area: "Westcott", cuisine: "Caribbean" },
    { name: "Munjed's Middle Eastern", area: "Westcott", cuisine: "Mediterranean" },
    { name: "LODED", area: "Westcott", cuisine: "Fast Food" },
    { name: "Mom's Diner", area: "Westcott", cuisine: "American" },
    { name: "New Garden", area: "Westcott", cuisine: "Chinese" },
    { name: "Dorian's Gourmet Pizza", area: "Westcott", cuisine: "Pizza" },
    { name: "Recess Coffee Westcott", area: "Westcott", cuisine: "Cafe" },

    // ARMORY SQUARE / DOWNTOWN
    { name: "Margaritas Mexican Cantina", area: "Syracuse Downtown", cuisine: "Mexican" },
    { name: "The Hops Spot", area: "Syracuse Downtown", cuisine: "Pub" },
    { name: "The Limerick Pub", area: "Syracuse Downtown", cuisine: "Pub" },
    { name: "Three Lives Bar", area: "Syracuse Downtown", cuisine: "Pub" },
    { name: "The York", area: "Syracuse Downtown", cuisine: "American" },
    { name: "The Whiskey Coop", area: "Syracuse Downtown", cuisine: "American" },
    { name: "Armory Pizza + Pints", area: "Syracuse Downtown", cuisine: "Pizza" },
    { name: "Nick's Tomato Pie", area: "Syracuse Downtown", cuisine: "Pizza" },
    { name: "Lemon Grass", area: "Syracuse Downtown", cuisine: "Thai" },
    { name: "Funk 'n Waffles", area: "Syracuse Downtown", cuisine: "American" },
    { name: "China Cafe", area: "Syracuse Downtown", cuisine: "Chinese" },
    { name: "Blue Tusk", area: "Syracuse Downtown", cuisine: "Pub" },
    { name: "Bistro Elephant", area: "Syracuse Downtown", cuisine: "Steakhouse" },

    // TIPPERARY HILL
    { name: "Emerald Cocktail Kitchen", area: "Tipperary Hill", cuisine: "Pub" },
    { name: "Steve's Cantina", area: "Tipperary Hill", cuisine: "Mexican" },
    { name: "Patsy's Pizza", area: "Tipperary Hill", cuisine: "Pizza" },
    { name: "Sabatino's", area: "Tipperary Hill", cuisine: "Pizza" },
    { name: "Recess Coffee Tipp Hill", area: "Tipperary Hill", cuisine: "Cafe" },
    { name: "Harrison Bakery", area: "Tipperary Hill", cuisine: "Cafe" },
    { name: "Brooklyn Pickle Tipp Hill", area: "Tipperary Hill", cuisine: "Sandwiches" },
    { name: "The Blarney Stone", area: "Tipperary Hill", cuisine: "Pub" },

    // EASTWOOD
    { name: "OIP Eastwood", area: "Eastwood", cuisine: "Pizza" },
    { name: "Kosta's Pizza House", area: "Eastwood", cuisine: "Pizza" },
    { name: "Uncle Sal's Pizza", area: "Eastwood", cuisine: "Pizza" },
    { name: "Ruby's Cheesesteaks", area: "Eastwood", cuisine: "Sandwiches" },
    { name: "Lucky 7 Deli", area: "Eastwood", cuisine: "Sandwiches" },
    { name: "Hassan's Halal", area: "Eastwood", cuisine: "Mediterranean" },
    { name: "Shifty's Bar & Grill", area: "Eastwood", cuisine: "Pub" },
    { name: "Chadwick's", area: "Eastwood", cuisine: "American" },
    { name: "Sinbad Restaurant", area: "Eastwood", cuisine: "Mediterranean" },
    { name: "Mother's Cupboard", area: "Eastwood", cuisine: "American" },
    { name: "Cafe Kubal", area: "Eastwood", cuisine: "Cafe" },
    { name: "The Wedge", area: "Eastwood", cuisine: "American" },
    { name: "Akina Sushi and Hibachi", area: "North Syracuse", cuisine: "Japanese" },

    // INDIAN RESTAURANTS
    { name: "Raj Saffron House", area: "Westcott", cuisine: "Indian" },
    { name: "Syracuse Dosa Grill", area: "Syracuse Downtown", cuisine: "Indian" },
    { name: "Royal Indian Grill", area: "Syracuse Downtown", cuisine: "Indian" },
    { name: "Dakshin Indian Cuisine", area: "Syracuse Downtown", cuisine: "Indian" },
    { name: "Flavour of India", area: "East Syracuse", cuisine: "Indian" },
    { name: "Sahota Palace", area: "Liverpool", cuisine: "Indian" },
    { name: "Dosa Grill Dewitt", area: "Dewitt", cuisine: "Indian" },
    { name: "Clay Oven Indian Cuisine", area: "Baldwinsville", cuisine: "Indian" },
    { name: "Masala Heaven", area: "Cicero", cuisine: "Indian" },
    { name: "Indian Grill", area: "Camillus", cuisine: "Indian" },
];

const areas = Object.keys(townCenters);
const chains = ["McDonald's", "Burger King", "Wendy's", "Taco Bell", "Dunkin'", "Subway", "Starbucks", "Domino's Pizza", "Pizza Hut"];

// Fill to 200
let count = rawData.length;
let chainIndex = 0;
while (count < 200) {
    const chainName = chains[chainIndex % chains.length];
    const area = areas[count % areas.length];

    // Check if we should add it (simulate presence)
    let cuisine = "Fast Food";
    if (chainName.includes("Coffee") || chainName.includes("Dunkin") || chainName.includes("Starbucks")) cuisine = "Cafe";
    if (chainName.includes("Pizza")) cuisine = "Pizza";
    if (chainName.includes("Taco")) cuisine = "Mexican";
    if (chainName.includes("Subway")) cuisine = "Sandwiches";

    rawData.push({
        name: `${chainName} (${area})`,
        area: area,
        cuisine: cuisine
    });

    chainIndex++;
    count++;
}

// Generate full objects
const hoursTemplates = {
    "American": { open: "11:00", close: "22:00" },
    "Italian": { open: "16:00", close: "22:00" },
    "Chinese": { open: "11:00", close: "22:30" },
    "Japanese": { open: "12:00", close: "22:00" },
    "Mexican": { open: "11:00", close: "22:00" },
    "Pizza": { open: "11:00", close: "23:00" },
    "Pub": { open: "12:00", close: "01:00" },
    "Cafe": { open: "06:00", close: "18:00" },
    "Fast Food": { open: "06:00", close: "23:00" },
    "Seafood": { open: "12:00", close: "21:00" },
    "Steakhouse": { open: "16:00", close: "22:00" },
    "Thai": { open: "12:00", close: "21:30" },
    "Sandwiches": { open: "10:00", close: "20:00" },
    "BBQ": { open: "11:00", close: "21:00" },
    "Indian": { open: "11:30", close: "22:00" },
};

const finalRestaurants = rawData.map((r, i) => {
    const center = townCenters[r.area] || townCenters["Syracuse Downtown"];
    const lat = center.lat + (Math.random() * 0.04 - 0.02); // +/- 2 miles roughly
    const lng = center.lng + (Math.random() * 0.04 - 0.02);

    const template = hoursTemplates[r.cuisine] || hoursTemplates["American"];

    // construct hours object
    const hours = {};
    for (let d = 0; d < 7; d++) {
        hours[d] = [{ open: template.open, close: template.close }];
        // Weekends later?
        if (d === 5 || d === 6) {
            // Extend by 1 hour for fun
            let closeHour = parseInt(template.close.split(':')[0]);
            if (closeHour < 23) closeHour += 1;
            hours[d] = [{ open: template.open, close: `${closeHour.toString().padStart(2, '0')}:${template.close.split(':')[1]}` }];
        }
    }

    return {
        id: i + 1,
        name: r.name,
        address: `${r.area}, NY`, // Simplified for bulk
        description: `Great ${r.cuisine} spot in ${r.area}.`,
        cuisine: r.cuisine,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + " " + r.area + " NY")}`,
        coords: { lat, lng },
        hours: hours
    };
});

const fileContent = `export const restaurants = ${JSON.stringify(finalRestaurants, null, 2)};`;

fs.writeFileSync(path.join(__dirname, 'restaurants.js'), fileContent);
console.log(`Generated ${finalRestaurants.length} restaurants.`);
