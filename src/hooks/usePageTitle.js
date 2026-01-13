import { useEffect } from "react";

export const COMPANY_NAME  = "Voco";

const usePageTitle = (pageTitle = '') => {
    useEffect(() => {
        document.title = pageTitle ? `${COMPANY_NAME} | ${pageTitle}` : COMPANY_NAME;
    }, [pageTitle]);
};


export default usePageTitle;
