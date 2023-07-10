
exports.getDate = function() { 

    let today = new Date();
    
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long"
        };
        return today.toLocaleDateString("en-US", options);
    };