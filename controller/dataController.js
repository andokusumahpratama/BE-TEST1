const dataModels = require('./../models/dataModels');

// * Get all data destination Attack
exports.getSourceAttackType = async (req, res) => {
    try{
        const data = await dataModels.findBySourceAttackType();

        res.status(200).json({
            success: true,
            statusCode: 200,
            data
        })
        
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
}

// * Get all data source Attack
exports.getDestinationAttackType = async (req, res) => {
    try{
        const data = await dataModels.findByDestinationAttackType();

        res.status(200).json({
            success: true,
            statusCode: 200,
            data
        })
        
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
}

// * Specific data source Attack
exports.getDataSourceAttackType = async (req, res) => {
    const dataSource = await dataModels.getDataSourceType(req.params.sourceCountry);

    const label = dataSource.map(obj => obj.type);
    const total = dataSource.map(obj => obj.jumlah);

    const data = {
        label: label,
        total: total
    };        

    res.status(200).json({
        success: true,
        statusCode: 200,
        data
    })
}

// * Specific data destination Attack
exports.getDataDestinationAttackType = async (req, res) => {
    const dataSource = await dataModels.getDataDestinationType(req.params.destinationCountry);

    const label = dataSource.map(obj => obj.type);
    const total = dataSource.map(obj => obj.jumlah);

    const data = {
        label: label,
        total: total
    };        

    res.status(200).json({
        success: true,
        statusCode: 200,
        data
    })
}