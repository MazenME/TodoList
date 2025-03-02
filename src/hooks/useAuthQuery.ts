import { QueryKey, useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/config.axios";
import { AxiosRequestConfig } from "axios";


interface IuseAuthQuery {
    queryKey :QueryKey;
    url :string;
    config?: AxiosRequestConfig;
}

const useAuthQuery = ({ queryKey, url, config }: IuseAuthQuery) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axiosInstance.get(url,config );      
      return data; 
    },
  });
};

export default useAuthQuery;
