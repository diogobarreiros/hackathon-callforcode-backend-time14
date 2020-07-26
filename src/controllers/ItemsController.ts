import { Request, Response } from 'express';

class ItemsController {
  async index(request: Request, response: Response) {
    return response.json({"message": "Call for code"});
  }
}

export default ItemsController;
