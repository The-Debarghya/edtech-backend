import chalk from "chalk";
import { Category, CategorySchemaType } from "../models/Category.js";
import { Request, Response } from "express";

type CreateCategoryFunctionType = (
  req: Request,
  res: Response
) => Promise<Response<any, Record<string, any>>>;

// createTag
export const createCategory: CreateCategoryFunctionType = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryDetails: CategorySchemaType | null = await Category.create({
      name,
      description,
    });
    console.log("Category created: ", categoryDetails);

    return res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// showAllCategories
export const showAllCategories: CreateCategoryFunctionType = async (
  req,
  res
) => {
  try {
    const allCategorys: CategorySchemaType[] | null = await Category.find(
      {},
      { name: true, description: true }
    ).exec();

    return res.status(200).json({
      success: true,
      message: "All categories returned successfully ",
      allCategorys,
    });
  } catch (err: any) {
    console.error(chalk.red.bold(err.message));
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// categoryPageDetails
export const categoryPageDetails = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.body;

    // Get courses for the specified category
    const selectedCategory: CategorySchemaType | null = await Category.findById(
      categoryId
    )
      .populate("courses")
      .exec();
    console.log(selectedCategory);
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    const selectedCourses = selectedCategory.courses;

    // Get courses for other categories
    const categoriesExceptSelected: CategorySchemaType[] | null =
      await Category.find({
        _id: { $ne: categoryId },
      })
        .populate("courses")
        .exec();
    let differentCourses = [];
    for (const category of categoriesExceptSelected) {
      differentCourses.push(...category.courses);
    }

    // Get top-selling courses across all categories
    const allCategories = await Category.find().populate("courses");
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      // .sort((a, b) => b.sold - a.sold) ==> TODO: add sold property in courses
      .slice(0, 10);

    res.status(200).json({
      success: true,
      message: "Selected category courses fetched successfully",
      data: {
        selectedCourses: selectedCourses,
        differentCourses: differentCourses,
        mostSellingCourses: mostSellingCourses,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
