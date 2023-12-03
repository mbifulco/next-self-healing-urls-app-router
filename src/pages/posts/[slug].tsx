import { getAllPosts, getPostById } from '@/utils/posts';
import type {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from 'next';
import slugify from 'slugify';

/**
 * Converts input to a URL-safe slug
 * @param {string} title - the title of the post
 * @returns {string} a URL-safe slug based on the post's title
 */
const titleToSlug = (title: string) => {
  const uriSlug = slugify(title, {
    lower: true, // convert everything to lower case
    trim: true, // remove leading and trailing spaces
  });

  // encode special characters like spaces and quotes to be URL-safe
  return encodeURI(uriSlug);
};

// simplified for sake of example
type Post = {
  id: string;
  title: string;
  content: string;
};

type PostPageParams = {
  slug: string;
};

type PostPageProps = {
  post: Post;
};

export const getStaticPaths: GetStaticPaths = async () => {
  // getAllPosts is an abstracted function that returns all posts for your site,
  // either from a database, or markdown files, or wherever you're storing them
  const posts = await getAllPosts();

  console.log('ppp', posts);

  // iterate over the posts and create a path for each one
  // using this pattern:
  // `https://example.com/posts/${POST_TITLE}-${POST_ID}`
  const paths = posts.map((post) => {
    const slug = `${titleToSlug(post.title)}-${post.id}`;
    console.log('slugged', slug);
    return {
      params: {
        slug,
      },
    };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<
  PostPageProps,
  PostPageParams
> = async ({ params }) => {
  if (!params || !params.slug) {
    throw new Error('Slug not provided');
  }

  // convert the slug to a URL-safe slug
  const slug = titleToSlug(params?.slug as string);

  // remove the last part of the slug for a post's ID
  const id = slug.split('-').pop();

  try {
    // note that this function isn't implemented here,
    // but it only searches for posts by _ID!_ so the title doesn't matter
    const post = await getPostById(id);
    return {
      props: { post },
    };
  } catch (error) {
    // if the post doesn't exist, this will redirect to the 404 page
    return { notFound: true };
  }
};

// For the sake of this example, we'll use a _very_ simple template for rendering the post itself:
const PostPage: NextPage<PostPageProps> = ({ post }) => {
  return (
    <div>
      <h1>Post: {post.title}</h1>
    </div>
  );
};

export default PostPage;
