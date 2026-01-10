/**
 * Third-Party Integrations Module
 * 
 * Centralized configuration for:
 * - CRM/Marketing: HubSpot, Mailchimp, ConvertKit
 * - Automation: Zapier, Make (Integromat), n8n
 * - Notifications: Slack, Discord, Email
 * - Social: Twitter, LinkedIn auto-share
 * 
 * @author Superheat Engineering
 */

// ============================================
// TYPES
// ============================================

export interface WebhookPayload {
    event: string
    timestamp: string
    data: Record<string, unknown>
    signature?: string
}

export interface IntegrationConfig {
    zapier?: { webhookUrl: string }
    make?: { webhookUrl: string }
    n8n?: { webhookUrl: string }
    slack?: { webhookUrl: string; channel?: string }
    discord?: { webhookUrl: string }
    hubspot?: { portalId: string; formId: string }
    mailchimp?: { listId: string; apiKey: string; dc: string }
    convertkit?: { formId: string; apiKey: string }
}

// ============================================
// HMAC SIGNATURE FOR WEBHOOK SECURITY
// ============================================

async function createHmacSignature(payload: string, secret: string): Promise<string> {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

// ============================================
// INTEGRATION HANDLERS
// ============================================

/**
 * Send to Zapier webhook
 */
export async function sendToZapier(
    webhookUrl: string,
    event: string,
    data: Record<string, unknown>
): Promise<boolean> {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event,
                timestamp: new Date().toISOString(),
                ...data,
            }),
        })
        return response.ok
    } catch (error) {
        console.error('[Zapier] Webhook failed:', error)
        return false
    }
}

/**
 * Send to Make (Integromat) webhook
 */
export async function sendToMake(
    webhookUrl: string,
    event: string,
    data: Record<string, unknown>
): Promise<boolean> {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event,
                timestamp: new Date().toISOString(),
                ...data,
            }),
        })
        return response.ok
    } catch (error) {
        console.error('[Make] Webhook failed:', error)
        return false
    }
}

/**
 * Send to n8n webhook
 */
export async function sendToN8n(
    webhookUrl: string,
    event: string,
    data: Record<string, unknown>,
    secret?: string
): Promise<boolean> {
    try {
        const payload = JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            data,
        })

        const headers: Record<string, string> = { 'Content-Type': 'application/json' }

        if (secret) {
            headers['X-N8N-Signature'] = await createHmacSignature(payload, secret)
        }

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers,
            body: payload,
        })
        return response.ok
    } catch (error) {
        console.error('[n8n] Webhook failed:', error)
        return false
    }
}

/**
 * Send Slack notification
 */
export async function sendToSlack(
    webhookUrl: string,
    message: string,
    options?: {
        channel?: string
        username?: string
        icon_emoji?: string
        blocks?: unknown[]
    }
): Promise<boolean> {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: message,
                ...options,
            }),
        })
        return response.ok
    } catch (error) {
        console.error('[Slack] Webhook failed:', error)
        return false
    }
}

/**
 * Send Discord notification
 */
export async function sendToDiscord(
    webhookUrl: string,
    message: string,
    options?: {
        username?: string
        avatar_url?: string
        embeds?: unknown[]
    }
): Promise<boolean> {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: message,
                ...options,
            }),
        })
        return response.ok
    } catch (error) {
        console.error('[Discord] Webhook failed:', error)
        return false
    }
}

/**
 * Add to HubSpot contact list
 */
export async function addToHubSpot(
    portalId: string,
    formId: string,
    fields: Record<string, string>
): Promise<boolean> {
    try {
        const response = await fetch(
            `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: Object.entries(fields).map(([name, value]) => ({ name, value })),
                    context: {
                        pageUri: typeof window !== 'undefined' ? window.location.href : '',
                        pageName: typeof document !== 'undefined' ? document.title : '',
                    },
                }),
            }
        )
        return response.ok
    } catch (error) {
        console.error('[HubSpot] Submission failed:', error)
        return false
    }
}

/**
 * Add to Mailchimp list
 */
export async function addToMailchimp(
    listId: string,
    apiKey: string,
    dc: string, // data center (e.g., 'us1')
    email: string,
    mergeFields?: Record<string, string>
): Promise<boolean> {
    try {
        const response = await fetch(
            `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `apikey ${apiKey}`,
                },
                body: JSON.stringify({
                    email_address: email,
                    status: 'pending', // Double opt-in
                    merge_fields: mergeFields || {},
                }),
            }
        )
        return response.ok || response.status === 400 // 400 = already exists
    } catch (error) {
        console.error('[Mailchimp] Submission failed:', error)
        return false
    }
}

/**
 * Add to ConvertKit form
 */
export async function addToConvertKit(
    formId: string,
    apiKey: string,
    email: string,
    firstName?: string,
    fields?: Record<string, string>
): Promise<boolean> {
    try {
        const response = await fetch(
            `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: apiKey,
                    email,
                    first_name: firstName,
                    fields,
                }),
            }
        )
        return response.ok
    } catch (error) {
        console.error('[ConvertKit] Submission failed:', error)
        return false
    }
}

// ============================================
// ORCHESTRATOR - SEND TO ALL CONFIGURED
// ============================================

export async function notifyAllIntegrations(
    config: IntegrationConfig,
    event: string,
    data: Record<string, unknown>
): Promise<{ success: string[]; failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] }

    const tasks: Promise<void>[] = []

    if (config.zapier) {
        tasks.push(
            sendToZapier(config.zapier.webhookUrl, event, data)
                .then(ok => { ok ? results.success.push('zapier') : results.failed.push('zapier') })
        )
    }

    if (config.make) {
        tasks.push(
            sendToMake(config.make.webhookUrl, event, data)
                .then(ok => { ok ? results.success.push('make') : results.failed.push('make') })
        )
    }

    if (config.n8n) {
        tasks.push(
            sendToN8n(config.n8n.webhookUrl, event, data)
                .then(ok => { ok ? results.success.push('n8n') : results.failed.push('n8n') })
        )
    }

    if (config.slack) {
        const message = `🔥 *New ${event}*\n` +
            Object.entries(data).map(([k, v]) => `• ${k}: ${v}`).join('\n')
        tasks.push(
            sendToSlack(config.slack.webhookUrl, message)
                .then(ok => { ok ? results.success.push('slack') : results.failed.push('slack') })
        )
    }

    if (config.discord) {
        const message = `🔥 **New ${event}**\n` +
            Object.entries(data).map(([k, v]) => `• ${k}: ${v}`).join('\n')
        tasks.push(
            sendToDiscord(config.discord.webhookUrl, message)
                .then(ok => { ok ? results.success.push('discord') : results.failed.push('discord') })
        )
    }

    await Promise.allSettled(tasks)

    return results
}
