export async function onRequestPost(context) {
    const { request } = context;
    const data = await request.json();
    const { email } = data;
  
    if (!email) {
      return new Response('Invalid input', { status: 400 });
    }
  
    const userMessage = {
      personalizations: [
        {
          to: [{ email }],
          subject: 'Welcome to NomadCrew Waitlist!',
        },
      ],
      from: { email: 'welcome@nomadcrew.uk', name: 'NomadCrew' },
      content: [
        {
          type: 'text/html',
          value: `<p>Hi,</p><p>Welcome to the NomadCrew waitlist! We're excited to have you on board.</p><p>Stay tuned for updates.</p>`,
        },
      ],
    };
  
    const adminMessage = {
      personalizations: [
        {
          to: [{ email: 'admin@nomadcrew.uk' }],
          subject: 'New NomadCrew Waitlist Signup',
        },
      ],
      from: { email: 'no-reply@nomadcrew.uk', name: 'NomadCrew' },
      content: [
        {
          type: 'text/plain',
          value: `New signup:\nEmail: ${email}\nTime: ${new Date().toISOString()}`,
        },
      ],
    };
  
    const sendEmail = async (message) => {
      const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Error sending email:', error);
        return new Response('Error sending email', { status: 500 });
      }
    };
  
    await sendEmail(userMessage);
    await sendEmail(adminMessage);
  
    return new Response('Signup successful', { status: 200 });
  }
  