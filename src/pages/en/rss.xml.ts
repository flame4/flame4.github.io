import { createRss } from "@/utils/createRss";

export async function GET() {
  return createRss("en");
}
