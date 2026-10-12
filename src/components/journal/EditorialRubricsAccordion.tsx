'use client';

import { useState } from 'react';
import type { EditorialRubric } from '@/content/site/official';

export type EditorialRubricItem = EditorialRubric & {
  plannedPublicationTitle?: string;
};

type Props = {
  rubrics: EditorialRubricItem[];
  eyebrow: string;
  title: string;
  intro: string;
  publicationLabel: string;
  forthcomingLabel: string;
};

export function EditorialRubricsAccordion({ rubrics, eyebrow, title, intro, publicationLabel, forthcomingLabel }: Props) {
  const [openId, setOpenId] = useState<string | null>(rubrics[0]?.id ?? null);

  const focusTrigger = (index: number) => {
    const rubric = rubrics[(index + rubrics.length) % rubrics.length];
    document.getElementById(`rubric-trigger-${rubric.id}`)?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusTrigger(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusTrigger(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTrigger(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTrigger(rubrics.length - 1);
    }
  };

  return (
    <div className="rubric-accordion">
      <div className="rubric-accordion__heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      <div className="rubric-accordion__list">
        {rubrics.map((rubric, index) => {
          const isOpen = openId === rubric.id;
          const panelId = `rubric-panel-${rubric.id}`;
          const triggerId = `rubric-trigger-${rubric.id}`;
          return (
            <div
              key={rubric.id}
              className={`rubric-accordion__item${isOpen ? ' is-open' : ''}`}
            >
              <h3>
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenId((current) =>
                      current === rubric.id ? null : rubric.id,
                    )
                  }
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className="rubric-accordion__trigger"
                >
                  <span className="rubric-accordion__index">
                    0{index + 1}
                  </span>
                  <span className="rubric-accordion__title">{rubric.title}</span>
                  <svg
                    className="rubric-accordion__chevron"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                className="rubric-accordion__panel"
              >
                <div className="rubric-accordion__panel-inner">
                  <p>{rubric.description}</p>
                  {rubric.plannedPublicationTitle ? (
                    <div className="rubric-accordion__publication">
                      <span>{publicationLabel}</span>
                      <strong>{rubric.plannedPublicationTitle}</strong>
                      <small>{forthcomingLabel}</small>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
