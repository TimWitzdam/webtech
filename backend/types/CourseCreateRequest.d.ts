import { Request } from "express";
import { ICourse } from "../models/course.model";

export interface CourseCreateRequest extends Request {
  course: ICourse;
}
