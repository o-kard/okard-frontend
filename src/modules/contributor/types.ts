import { Post } from "../post/types/post";

export interface Contributor {
    id: string;
    user_id: string;
    post_id: string;
    total_amount: number;
    updated_at: string;
}

export interface ContributorWithPost extends Contributor {
    post: Post;
}
