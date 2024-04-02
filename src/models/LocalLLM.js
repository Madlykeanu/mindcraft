import axios from 'axios';

export class LocalLLM {
    constructor() {
        this.url = 'http://192.168.1.77:1000/v1/chat/completions';
        this.headers = {
            'Content-Type': 'application/json'
        };
        this.defaultPayload = {
            'model': 'localLLM',
            'max_tokens': 1024,
            'stream': true
        };
    }

    async sendRequest(turns, systemMessage) {
        let prev_role = null;
        let messages = [];
        let filler = {role: 'user', content: '_'};

        // Adjust message formatting to be consistent with Claude.js
        for (let turn of turns) {
            if (turn.role === 'system') {
                turn.role = 'user';
                turn.content = 'SYSTEM: ' + turn.content;
            }
            if (turn.role === prev_role && turn.role === 'assistant') {
                // Insert empty user message to separate assistant messages
                messages.push(filler);
                messages.push(turn);
            } else if (turn.role === prev_role) {
                // Combine new message with previous message instead of adding a new one
                messages[messages.length - 1].content += '\n' + turn.content;
            } else {
                messages.push(turn);
            }
            prev_role = turn.role;
        }
        if (messages.length === 0) {
            messages.push(filler);
        }

        // Prepare the payload with the adjusted messages
        const payload = {
            messages: messages,
            temperature: 0.7,
            max_tokens: 500,
            stream: false
        };

        try {
            const response = await axios.post(this.url, payload, { headers: this.headers });

            if (response.data.error) {
                console.error('API error:', response.data.error);
                return 'My brain disconnected, try again.';
            }

            return response.data.choices[0].text;
        } catch (error) {
            console.error('Error sending request to API:', error);
            return 'My brain disconnected, try again.';
        }
    }

    async embed(text) {
        // If your local LLM doesn't support text embeddings, you can remove or modify this method
        return Array(1).fill().map(() => Math.random()); // Return a random embedding for now
    }
}