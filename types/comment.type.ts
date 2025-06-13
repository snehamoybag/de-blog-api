import { Comment as PrismaComment, Role } from "../generated/prisma";

type Comment = PrismaComment & {
  author: { id: number; firstName: string; lastName: string; role: Role };

  count: {
    likes: number;
    replies: number;
  };

  userInteractions: {
    like: boolean;
    reply: boolean;
  };
};

export default Comment;
