const handleApiCall = () => (req,res) => {
	// PAT (Personal Access Token) can be found in the portal under Authentication
    const PAT = process.env.CLARIFAI_PAT;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = process.env.CLARIFAI_USER_ID;       
    const APP_ID = process.env.CLARIFAI_APP_ID;
    // Model and image URL you want to use
    const MODEL_ID = process.env.CLARIFAI_MODEL_ID;
    const MODEL_VERSION_ID = process.env.CLARIFAI_MODEL_VERSION_ID; 
    const IMAGE_URL = req.body.input; // React setState quirk we should be vary of.

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
    	.then(response => response.json())
    	.then(data => res.status(200).json(data))
    	.catch(err => res.status(400).json('An error occurred while calling the Clarifai API.'))
}


const handleImage = (db) => (req,res) => {
	const { id } = req.body;
	db('users').where('id','=',id)
	.increment('entries',1)
	.returning('entries')
	.then(entries=> {
		res.status(200).json(entries[0].entries);
	})
	// .catch(err=>res.status(400).json('Unable to increment entries.'));
    .catch(err=>console.log(err));
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}