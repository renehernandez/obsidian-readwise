export interface ITemplateType {
    defaultTemplate(): string;

    type(): string;
}

export class HeaderTemplateType implements ITemplateType {
    type(): string {
        return "header template";
    }

    defaultTemplate(): string {
        return `- **URL:** {{ source_url }}
- **Author:** {{ author }}
- **Tags:** #{{ category }}
- **Date:** [[{{ updated }}]]
---
`;
    }
}

export class HighlightTemplateType implements ITemplateType {
    type(): string {
        return "highlight template";
    }

    defaultTemplate(): string {
        return `{{ text }} %% id: {{ id }} %%
{%- if note %}
Note: {{ note }}
{%- endif %}
`;
    }
}
