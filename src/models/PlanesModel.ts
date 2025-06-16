import { handleAxiosError } from "@/utils/axiosErros";
import axios from "axios";

export interface Plan {
    max_images_per_publication: number;
    max_stores :number;
    max_publications_per_store: number;
}


export const GetUserPlanDetails = async (token: string, userId: string): Promise<Plan> => {
    try {
        const url = `${process.env.NEXT_PUBLIC_APIGO_URL}/api/planes/${userId}`;
        const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        return res.data.plan;
    } catch (error) {
        handleAxiosError(error, "Planes");
        throw error;
    }
};
