import { NextApiRequest, NextApiResponse } from "next";

// Extend NextApiRequest to include user property
declare module "next" {
  interface NextApiRequest {
    user?: jwt.JwtPayload;
  }
}
import jwt from "jsonwebtoken";
import { handleApiError } from "./errorHandler";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Hàm lấy token từ header Authorization
function getToken(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
}

// Middleware xác thực JWT
export function authenticate(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getToken(req);

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided, Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      // Gán thông tin người dùng đã xác thực vào req.user
      req.user = decoded as jwt.JwtPayload;

      // Gọi handler tiếp theo nếu xác thực thành công
      return handler(req, res);
    } catch (error) {
      // Xử lý lỗi token không hợp lệ hoặc hết hạn
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ message: "Token expired, please login again" });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        // Sử dụng hàm xử lý lỗi nếu xảy ra lỗi khác
        return handleApiError(res, error);
      }
    }
  };
}