'use server';

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

export async function sendEmail(senderEmail: string, recipientEmail: string, subject: string, body: string): Promise<void> {
  const sesClient = new SESv2Client({ 
    region: "ap-northeast-2",
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    } : undefined
  });
  const sendEmailCommand = new SendEmailCommand({
    FromEmailAddress: senderEmail,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Content: {
      Simple: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body,
          },
        },
      },

    }
  });

  try {
    await sesClient.send(sendEmailCommand);
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
