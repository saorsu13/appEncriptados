import apiv2 from "@/config/apiv2";

export const getPosts = async (): Promise<string[]> => {
  try {
    const response = await apiv2.get<string[]>(`posts`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

interface PostImage {
  guid: {
    rendered: string;
  };
}

export const getPostImage = async (id: string | number): Promise<PostImage> => {
  try {
    const response = await apiv2.get<PostImage>(`media/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch post image");
  }
};

interface Post {
  featured_media: string;
  content: {
    rendered: string; // Asumiendo que `rendered` es un campo de tipo string en la respuesta de la API
    // Puedes ajustar este tipo según la estructura real de la respuesta de `posts/${id}`
  };
  // Puedes añadir más propiedades según la estructura completa del post
}

export const getPostById = async (id: string | number): Promise<Post> => {
  try {
    const response = await apiv2.get<Post>(`posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch post");
  }
};
