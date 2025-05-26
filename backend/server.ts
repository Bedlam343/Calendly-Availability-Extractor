import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const router = express.Router();
router
  .route('/')
  .post(async (req: Request, res: Response, next: NextFunction) => {
    const { calendlyUrl } = req.body;

    console.log(calendlyUrl);

    res.status(200).json({});
  });

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/', router);

const PORT = 3000;

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`),
);
