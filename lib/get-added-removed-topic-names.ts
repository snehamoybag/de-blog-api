import Blog from "../types/blog.type";

const getAddedAndRemovedTopicNames = (topicNames: string[], blog: Blog) => {
  const prevTopicNames = blog.topics.map((topic) => topic.name);

  const addedTopicNames = topicNames.filter(
    (name) => !prevTopicNames.includes(name)
  );
  const removedTopicNames = prevTopicNames.filter(
    (name) => !topicNames.includes(name)
  );

  return [addedTopicNames, removedTopicNames];
};

export default getAddedAndRemovedTopicNames;
