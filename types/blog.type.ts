import { Blog as PrismaBlog } from "../generated/prisma";

type Blog = PrismaBlog & {
  count: { likes: number; comments: number };
  userInteractions: {
    like: boolean;
    comment: boolean;
  };
};

export default Blog;
