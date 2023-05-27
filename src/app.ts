import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import {Request,Response, NextFunction} from 'express';

var CornJob = require ('cors').CornJob;

import {mongoconnect} from './utils/database';
import routes from './router';

export const app: any = {	
	instance: express(),
	async init() {
		this.initConfig();
		await this.initDatabase();
		this.initRoutes();
	},

    	/**
	 * Initialize the database connection with MongoDB
	 */
	initDatabase(): Promise<void> {
		return new mongoconnect().connectToDb();
	},

    initConfig() {
		this.instance.use(cors());
		this.instance.use(bodyParser.json());
		this.instance.use(bodyParser.urlencoded({ extended: false }));
		this.instance.use(function (req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, authtoken, access_token, Accept, authorization");
			res.header("Access-Control-Allow-Methods", "*");
			console.info('--------------------------------request Details----------------------------------------', req.originalUrl);
			console.info('auth-token', req.headers['token']);
			console.info('authorization', req.headers['authorization']);
			console.info('-----------------------------------------ENDS------------------------------------------');
			if (req.method === 'OPTIONS') {
				res.send(200);
			} else {
				next();
			}
		});
	},
	initRoutes() {
		this.instance.use(express.static(path.join(__dirname, 'dist')));
		this.instance.use('/api/v1/public', express.static(path.join(__dirname, 'public')))
		this.instance.use('/public', express.static(path.join(__dirname, 'public')))
		this.instance.use('/api', routes);
		this.instance.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, 'dist/index.html'));
		});
		this.instance.use((req: Request, res: Response, next: NextFunction) => {
			const err = new Error('Not Found');
			err['status'] = 404;
			next(err);
		});
		this.instance.use((err, req: Request, res: Response, next: NextFunction) => {
			res.status(err.status || 500);
			res.send({ success: false, message: err.message, result: {}, statusCode: err.status });
		});

	},
};