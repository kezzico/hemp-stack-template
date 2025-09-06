import express from 'express';

export default function({ dbpool }) {
    const router = express.Router();    

    // sample route with database query
    router.get('/world', async (req, res) => {

        // get a connection from the pool
        const db = await dbpool.getConnection();

        // execute a query with parameters
        try {
            const params = [ 1 ]
            const [result] = await db.query(` 
                SELECT ? 
            `, params );

        // catch any errors
        } catch (error) {
            console.error('Database query error:', error);
            res.status(500).send('Internal Server Error');

        // release the db connection back to the pool
        } finally {
            db.release();
        }

        res.status(200).send({ message: 'Hello World!'});
    });

    return router;
};

