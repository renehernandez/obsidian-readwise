import type { Express } from "express";
import express from "express";
import cors from "cors";
import axios, { AxiosInstance } from "axios";
import Log from "src/log";
import type { AddressInfo } from "net";

const API_URL = "https://readwise.io/api/v2/"

export class ProxyServer {

    private app: Express;
    private axiosInstance: AxiosInstance;
    private port: number;

    constructor(token: string) {
        this.app = express()
        this.app.use(cors())
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            }
        })

        this.axiosInstance.interceptors.request.use(config => {
            Log.debug(`Request: ${JSON.stringify(config)}`);
            return config;
        });

        this.setBooksEndpoint();

        const server = this.app.listen();
        this.port = (server.address() as AddressInfo).port;
        Log.debug(`Running proxy server at ${this.port}`);
    }

    setBooksEndpoint() {
        const instance = this.axiosInstance;
        this.app.get('/books', function(req, res) {
            Log.debug("Invoking books endpoint in readwise API")
            return instance.get('/books', {
                params: req.query,
            }).then(response => {
                Log.debug({message: response.statusText, context: response})
                if (response.statusText == 'OK') {
                    res.json(response.data);
                }
            }).catch(err => {
                Log.error(err);
                res.send(err);
            })
        });
    }

    async get(path: string, params: Record<string, any>): Promise<Response> {
        const url = new URL(`http://localhost:${this.port}/${path}`);

        url.search = new URLSearchParams(params).toString();

        return fetch(url.toString());
    }
}