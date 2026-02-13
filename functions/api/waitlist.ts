const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Content-Type': 'application/json'
};

export async function onRequest(context) {
  const { request } = context;
  const { method } = request;

  console.log(`[Waitlist] Handling ${method} request`);

  if (method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }

  if (method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
        method: method
      }),
      {
        status: 405,
        headers: corsHeaders
      }
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('[Waitlist] JSON parse error:', e);
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON in request body',
          details: e.message
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({
          error: 'Email is required'
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    console.log(`[Waitlist] Processing signup for email: ${email}`);

    // Store in Supabase if configured
    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseAnonKey = context.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      try {
        console.log(`[Waitlist] Inserting into Supabase: ${supabaseUrl}/rest/v1/waitlist_signups`);
        const dbRes = await fetch(`${supabaseUrl}/rest/v1/waitlist_signups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ email })
        });
        if (dbRes.ok || dbRes.status === 201) {
          console.log('[Waitlist] Supabase insert successful, status:', dbRes.status);
        } else if (dbRes.status === 409) {
          console.log('[Waitlist] Email already exists in waitlist (duplicate)');
        } else {
          const errText = await dbRes.text();
          console.error('[Waitlist] Supabase insert error:', dbRes.status, errText);
        }
      } catch (e) {
        console.error('[Waitlist] Supabase error:', e);
      }
    }

    // Verify Resend API key is present
    if (!context.env.RESEND_API_KEY) {
      console.error('[Waitlist] Missing RESEND_API_KEY environment variable');
      return new Response(
        JSON.stringify({
          error: 'Server configuration error',
          details: 'Email service not properly configured'
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }

    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'NomadCrew <welcome@nomadcrew.uk>',
          to: email,
          subject: 'Welcome to NomadCrew Waitlist! 🌍',
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
              </head>
              <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                  <header style="text-align: center; margin-bottom: 32px;">
                    <h1 style="color: #F46315; margin: 0;">Welcome to NomadCrew! 🌍</h1>
                  </header>
                  
                  <main style="background: #f9fafb; padding: 24px; border-radius: 8px;">
                    <p style="margin-top: 0;">Thanks for joining our waitlist! We're excited to have you on board.</p>
                    <p>We're building NomadCrew to make group travel coordination seamless and enjoyable. Here's what you can look forward to:</p>
                    <ul style="padding-left: 20px;">
                      <li>Real-time location sharing with your travel group</li>
                      <li>Easy expense splitting and tracking</li>
                      <li>Collaborative trip planning tools</li>
                      <li>Group chat and coordination features</li>
                    </ul>
                    <p>We'll keep you updated on our progress and let you know as soon as we're ready to launch.</p>
                  </main>

                  <footer style="margin-top: 32px; text-align: center; color: #6b7280; font-size: 14px;">
                    <p style="margin: 0;">Best regards,<br>The NomadCrew Team</p>
                    <p style="margin-top: 16px;">
                      <a href="https://nomadcrew.uk" style="color: #F46315; text-decoration: none;">nomadcrew.uk</a>
                    </p>
                  </footer>
                </div>
              </body>
            </html>
          `
        })
      });

      const resendData = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error('[Waitlist] Resend API error:', resendData);
        throw new Error(resendData.message || 'Failed to send email');
      }

      console.log('[Waitlist] Email sent successfully:', resendData.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Successfully joined waitlist'
        }),
        {
          status: 200,
          headers: corsHeaders
        }
      );
    } catch (error) {
      console.error('[Waitlist] Email send error:', error);
      return new Response(
        JSON.stringify({
          error: 'Failed to send confirmation email',
          details: error.message
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }
  } catch (error) {
    console.error('[Waitlist] Server error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}