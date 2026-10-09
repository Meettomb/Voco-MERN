import { getDashboardSummary } from "../services/facade/dashboardFacade.js";

export const getDashboardData = async (req, res) => {
  try {
    const dashboardData = await getDashboardSummary();

    return res.json({
      status: 1,
      data: dashboardData
    });
  } catch (error) {
    return res.json({
      status: 0,
      message: error.message
    });
  }
};
