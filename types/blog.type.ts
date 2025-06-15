import { Blog as PrismaBlog, Topic } from "../generated/prisma";

type Blog = PrismaBlog & {
  topics: Topic[];
  count: { likes: number; comments: number };
  userInteractions: {
    like: boolean;
    comment: boolean;
  };
};

export default Blog;
