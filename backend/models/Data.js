const mongoose = require('mongoose');

// Status Model 
const Status_Schema = new mongoose.Schema({
    status_name: { type: String, required: true }
});
const Status_Model = mongoose.model("status", Status_Schema);

// Usage Model 
const Usage_Schema = new mongoose.Schema({
    use_type: { type: String, required: true }
});
const Usage_Model = mongoose.model("usage", Usage_Schema);

// Countries Model 
const Countries_Schema = new mongoose.Schema({
    country_name: { type: String, required: true }
});
const Countries_Model = mongoose.model("countries", Countries_Schema);

// Cities Model
const Cities_Schema = new mongoose.Schema({
    country_id: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to the countries collection
        ref: "countries", // The name of the Countries model
        required: true 
    },
    city_name: { type: String, required: true, unique: true },
    map: {type: String}
});
const Cities_Model = mongoose.model("cities", Cities_Schema);

// Addresses Model
const Addresses_Schema = new mongoose.Schema({
    city_id: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to the cities collection
        ref: "cities", // The name of the cities model
        required: true 
    },
    street: { type: String, required: true },
    coordinates: { type: [Number], required: true }
    
});

const Addresses_Model = mongoose.model("addresses", Addresses_Schema);

// BDR Model 
const bdr_Schema = new mongoose.Schema({
    bdr_name: { type: String, required: true }
});
const bdr_Model = mongoose.model("bdr", bdr_Schema);

// Buildings Model
const Buildings_Schema = new mongoose.Schema({
    building_name: { type: String},
    area: { type: String},
    ar_description: { type: String },
    en_description: { type: String},
    thsLink: { type: String},
    frontImageLink: { type: String},
    dateOfConstruction: { type: Number},
    documentationDate: { type: Number},
    numberOfFloors: { type: String},
    bdr_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "bdr" 
    },
    address_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "addresses"
    } 
});
const Buildings_Model = mongoose.model("buildings", Buildings_Schema);

// Buildings_Status Model
const Buildings_Status_Schema = new mongoose.Schema({
    building_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "buildings",
        required: true
    },
    status_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "status",
        required: true
    }
});
const Buildings_Status_Model = mongoose.model("buildings_status", Buildings_Status_Schema);


// Buildings_Usage Model
const Buildings_Usage_Schema = new mongoose.Schema({
    building_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "buildings",
        required: true
    },
    usage_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "usage",
        required: true
    },
    type: { type: String}
});
const Buildings_Usage_Model = mongoose.model("buildings_usages", Buildings_Usage_Schema);




// Architects Model
const Architects_Schema = new mongoose.Schema({
    architect_name: { type: String},
    architect_image: { type: String},
    en_biography: { type: String },
    ar_biography: { type: String},
});
const Architects_Model = mongoose.model("architects", Architects_Schema);

// Buildings_Architects Model
const Buildings_Architects_Schema = new mongoose.Schema({
    building_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "buildings",
        required: true
    },
    architect_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "architects",
        required: true
    }
});
const Buildings_Architects_Model = mongoose.model("buildings_architects", Buildings_Architects_Schema);

// Notaries Model
const Notaries_Schema = new mongoose.Schema({
    notary_name: { type: String, required: true }
});
const Notaries_Model = mongoose.model("notaries", Notaries_Schema);

// Buildings_Notaries Model
const Buildings_Notaries_Schema = new mongoose.Schema({
    building_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "buildings",
        required: true
    },
    notary_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "notaries",
        required: true
    },
   building_name: { type: String}
});
const Buildings_Notaries_Model = mongoose.model("buildings_notaries", Buildings_Notaries_Schema);

// Owners Model 
const Owners_Schema = new mongoose.Schema({
    owner_name: { type: String, required: true }
});
const Owners_Model = mongoose.model("owners", Owners_Schema);

// Buildings_Owners Model
const Buildings_Owners_Schema = new mongoose.Schema({
    building_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "buildings",
        required: true
    },
    owner_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "owners",
        required: true
    }
});
const Buildings_Owners_Model = mongoose.model("buildings_owners", Buildings_Owners_Schema);

// Tenants Model
const Tenants_Schema = new mongoose.Schema({
    tenant_name: { type: String, required: true }
});
const Tenants_Model = mongoose.model("tenants", Tenants_Schema);

// Buildings_Tenants Model
const Buildings_Tenants_Schema = new mongoose.Schema({
    building_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "buildings",
        required: true
    },
    tenant_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "tenants",
        required: true
    }
});
const Buildings_Tenants_Model = mongoose.model("buildings_tenants", Buildings_Tenants_Schema);


// Images Model
const Images_Schema = new mongoose.Schema({
    building_id: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "buildings",
        required: true
    },
    description: { type: String, required: true },
    image: { type: String, required: true },
});
const Images_Model = mongoose.model("images", Images_Schema);



// Export all models as an object
module.exports = {
    Status_Model,
    Usage_Model,
    Countries_Model,
    Cities_Model,
    Addresses_Model,
    bdr_Model,
    Buildings_Model,
    Architects_Model,
    Buildings_Architects_Model,
    Notaries_Model,
    Buildings_Notaries_Model,
    Owners_Model,
    Buildings_Owners_Model,
    Tenants_Model,
    Buildings_Tenants_Model,
    Buildings_Status_Model,
    Buildings_Usage_Model,
    Images_Model
};
