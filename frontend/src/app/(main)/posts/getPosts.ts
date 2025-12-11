import { axiosInstance } from "@/lib/axios-instance";

export async function getPostsServerSide(token: string) {
  try {
    const resp = await axiosInstance.get("/posts", {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    return resp.data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}
