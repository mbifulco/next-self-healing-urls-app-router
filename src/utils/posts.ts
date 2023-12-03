import slugify from 'slugify';

type Post = {
  id: string;
  title: string;
  content: string;
};

export const posts: Post[] = [
  {
    id: 'abcdef',
    title: 'Hello World',
    content: 'This is my first post!',
  },
  {
    id: 'hijklm',
    title: 'Second post',
    content: 'Hello again!',
  },
];

export const getAllPosts = () => posts;

export const getPostById = (id?: string) => {
  if (!id) {
    throw new Error('No ID provided');
  }

  const post = posts.find((post) => post.id === id);

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};
