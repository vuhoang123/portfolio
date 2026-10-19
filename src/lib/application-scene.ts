export type RequestPhase = "ready" | "typing" | "sending" | "processing" | "writing" | "returning" | "success";
export type SceneNode = "interface" | "api" | "database";

export const phaseCopy: Record<RequestPhase, string> = {
  ready: "Name a record, then send it through the app.",
  typing: "Building the request payload…",
  sending: "Sending the request to the API…",
  processing: "The API validates the record…",
  writing: "Writing the record to the database…",
  returning: "Returning the saved record to the interface…",
  success: "201 Created. Your record is saved.",
};

export const phaseNode: Record<RequestPhase, SceneNode | null> = {
  ready: null,
  typing: "interface",
  sending: "interface",
  processing: "api",
  writing: "database",
  returning: "api",
  success: "interface",
};
