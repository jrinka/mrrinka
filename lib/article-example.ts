import type { LiteraryReading } from "./literary-reading";

export const articleExample: LiteraryReading = {
  "title": "Lensa AI and artists’ work",
  "author": "Brendan Paul Murphy",
  "question": "How and to what effect is figurative language used in shaping the meaning of this text?",
  "questionCredit": "Supplied guiding question",
  "context": "The Conversation, December 2022; supplied here in an abridged version. The opening reading-group label is editorial; the three question headings are from the source. The article’s technical and legal claims are read in their original context.",
  "wholeLabel": "Whole article",
  "image": {
    "url": "/examples/lensa-page-1.png",
    "width": 980,
    "height": 1132,
    "alt": "Article headline above a vividly coloured AI-generated portrait. The caption contrasts the image with an uncertain future for artists and says copyright law might need to catch up. Image credited to Stable Diffusion. The opening paragraphs follow beneath the caption."
  },
  "sources": [
    {
      "label": "Source page 1",
      "url": "/examples/lensa-page-1.png"
    },
    {
      "label": "Source page 2",
      "url": "/examples/lensa-page-2.png"
    },
    {
      "label": "Longer original article",
      "url": "https://theconversation.com/no-the-lensa-ai-app-technically-isnt-stealing-artists-work-but-it-will-majorly-shake-up-the-art-world-196480"
    }
  ],
  "credit": "Brendan Paul Murphy, The Conversation (December 2022), supplied in an abridged exam version, November 2024 TZ2 Text 1. Image credit in the supplied caption: Stable Diffusion. Wording and paragraph boundaries follow the supplied text; typography and footnote placement are normalized. Rights remain with their holders. Commentary and models are original teaching material.",
  "footnotes": "Supplied caption: “The rise of AI image generators spells a somewhat uncertain future for artists. Copyright law might need to catch up.” Image: Stable Diffusion. The supplied footnote identifies Midjourney, OpenAI and the CompVis group as developers central to image generation through machine learning. This note reports the exam’s explanatory context, not current technical guidance.",
  "passages": [
    {
      "title": "Opening: appeal and disagreement",
      "paragraphs": [
        "**No, the Lensa AI app technically isn’t stealing artists’ work – but it will majorly shake up the art world**",
        "The Lensa photo and video editing app has shot into social media prominence in recent weeks, after adding a feature that lets you generate stunning digital portraits of yourself in contemporary art styles. It does that for just a small fee and the effort of uploading 10 to 20 different photographs of yourself.",
        "2022 has been the year text-to-media AI technology left the labs and started colonising our visual culture, and Lensa may be the slickest commercial application of that technology to date.",
        "It has lit a fire among social media influencers looking to stand out – and a different kind of fire among the art community. Australian artist Kim Leutwyler told the Guardian she recognised the styles of particular artists – including her own style – in Lensa’s portraits.",
        "Since Midjourney, OpenAI’s Dall-E and the CompVis group’s Stable Diffusion* burst onto the scene earlier this year, the ease with which individual artists’ styles can be emulated has sounded warning bells. Artists feel their intellectual property – and perhaps a bit of their soul – has been compromised. But has it?",
        "Well, not as far as existing copyright law sees it."
      ]
    },
    {
      "title": "If it’s not direct theft, what is it?",
      "paragraphs": [
        "Text-to-media AI is inherently very complicated, but it is possible for us non-computer-scientists to understand conceptually.",
        "To really grasp the positives and negatives of Lensa, it’s worth taking a couple of steps back to understand how artists’ individual styles can find their way into, and out of, the black boxes that power systems like Lensa.",
        "Lensa is essentially a streamlined and customised front-end for the freely available Stable Diffusion deep learning model. It’s so named because it uses a system called latent diffusion to power its creative output."
      ]
    },
    {
      "title": "What makes Lensa stand out?",
      "paragraphs": [
        "Lensa takes user-supplied photos and injects them into Stable Diffusion’s existing knowledge base, teaching the system how to “capture” the user’s features so it can then stylise them. While this can be done in the regular Stable Diffusion, it’s far from a streamlined process.",
        "Although you can’t push the images on Lensa in any particular desired direction, the trade-off is a wide variety of options that are almost always impressive. These images borrow ideas from other artists’ work, but do not contain any actual snippets of their work.",
        "The Australian Arts Law Centre makes it clear that while individual artworks are subject to copyright, the stylistic elements and ideas behind them are not."
      ]
    },
    {
      "title": "What about the artists?",
      "paragraphs": [
        "Nonetheless, the fact that art styles and techniques are now transferable in this way is immensely disruptive and extremely upsetting for artists. As technologies like Lensa become more mainstream and artists feel increasingly ripped-off, there may be pressure for legislation to adapt to it.",
        "For artists who work on small-scale jobs, such as creating digital illustrations for influencers or other web enterprises, the future looks challenging.",
        "However, while it is easy to make an artwork that looks good using AI, it’s still difficult to create a very specific work, with a specific subject and context. So regardless of how apps like Lensa shake up the way art is made, the personality of the artist remains an important context for their work.",
        "It may be that artists themselves will need to borrow a page from the influencer’s handbook and invest more effort in publicising themselves.",
        "It’s early days, and it’s going to be a tumultuous decade for producers and consumers of art. But one thing is for sure: the genie is out of the bottle."
      ]
    }
  ],
  "sections": {
    "read-the-article-as-a-whole": {
      "label": "Read the whole article",
      "phase": "Orient",
      "passage": null
    },
    "begin-with-a-qualified-correction": {
      "label": "Headline & image",
      "phase": "Analyse",
      "passage": 0
    },
    "make-excitement-and-alarm-share-an-image": {
      "label": "Excitement & alarm",
      "phase": "Analyse",
      "passage": 0
    },
    "guide-readers-through-an-unfamiliar-system": {
      "label": "Make the system approachable",
      "phase": "Analyse",
      "passage": 1
    },
    "separate-legal-explanation-from-human-consequences": {
      "label": "Explanation & consequences",
      "phase": "Analyse",
      "passage": 3
    },
    "end-with-change-that-cannot-be-reversed": {
      "label": "An irreversible change",
      "phase": "Analyse",
      "passage": 3
    },
    "build-an-analytical-response": {
      "label": "Build a response",
      "phase": "Write",
      "passage": 0
    },
    "practice-and-transfer": {
      "label": "Practice & transfer",
      "phase": "Write",
      "passage": 1
    }
  },
  "fields": [
    {
      "key": "contrast",
      "label": "The article’s developing explanation",
      "hint": "What does the article clarify, and what concern remains?"
    },
    {
      "key": "evidence",
      "label": "Connected evidence",
      "hint": "Choose images from different parts of the article and explain their relationship."
    },
    {
      "key": "analysis",
      "label": "Your analytical paragraph",
      "hint": "Connect figurative language, understanding and the article’s developing message."
    }
  ],
  "checks": [
    "Have I explained the specific association an image introduces?",
    "Have I distinguished the writer’s account from the views attributed to others?",
    "Have I followed the article’s qualifications as well as its forceful statements?",
    "Have I answered the guiding question using the supplied version?"
  ],
  "filename": "lensa-article-notes"
};
