---
title: AI Production Needs Its Own Process Knowledge
description: Follow product images from generation to delivery to account for users' remaining work, prioritize delivery bottlenecks, and retain validated processes, acceptance methods, and exception handling.
lang: en
urlSlug: ai-production-industrial-lessons
translationKey: ai-production-industrial-lessons
publishedAt: 2026-10-10
category: systems
draft: false
---

Suppose a seller wants a batch of product images ready for listing every day. A system that generates attractive images is a good start. But the seller still needs to check whether the product has been distorted, whether packaging text is accurate, and whether the images meet listing requirements. Results that fail need revisions; uncertain cases need someone to confirm them. All of this takes time.

This article began with a discussion about the cost of AI production. To work out how much a task costs, we have to keep asking: which results can be delivered, who remedies failed attempts, and how much time must the user still spend? Following these questions leads us through the entire task, from its beginning to delivery.

What interests me is how much of that work an AI product intends to take on. For businesses that can already generate candidates and need to deliver repeatedly against agreed requirements, **selection, correction, acceptance checks, and exception handling around generation should themselves become product capabilities.** How well these are done affects how much help the user ultimately receives.

Drawing on industrial production, I want to make three judgments: efficiency should be measured through completion of the agreed work, engineering investment should follow delivery bottlenecks, and effective methods should become processes that can be reused and tested again.

By process knowledge, I mean validated input conditions, processing steps, acceptance methods, and arrangements for exceptions that together support completing a class of tasks.

This article mainly concerns work whose direction is already established and that must be delivered repeatedly against agreed requirements. In creative exploration, candidates may have value in themselves; being unselected does not mean they failed. Mixing these stages can count exploration as rework, or mistake one success for a reliable delivery capability.

## Count the work users still have to do

Return to the product images. After a model call finishes, the remaining work is easily reduced to a casual sentence in a product description: users can select and adjust the results themselves.

For someone handling a batch of products every day, however, “select and adjust” may be the most demanding part. They must compare each image with the original, identify whether the model changed the product, and handle errors that are occasional but cannot be ignored. Sometimes they must try repeatedly until they get a usable result.

Leaving this work to users can be an explicit product choice. The product may indeed save considerable time. But when we claim it improves production efficiency, the part users still perform should count. Work leaving the platform does not mean it has been completed.

[ASQ's cost-of-quality framework](https://asq.org/quality-resources/cost-of-quality) considers prevention, appraisal, and failure costs before and after delivery. The lesson I draw is straightforward: to judge whether a production method is economical, consider what it takes to obtain acceptable results. Cheaper generation followed by more selection and remediation may not reduce the total investment.

For products of this kind, I would first follow a group of tasks from input through acceptance. Model resources, human time, the amount completed by the agreed deadline, and the amount still unfinished all need to be considered together. Resources consumed by failed attempts should count too. Looking only at the final successful results removes part of the work required to obtain them. Comparisons between approaches also need similar input scopes and delivery requirements; otherwise, taking on simpler tasks can easily be mistaken for an efficiency gain.

Repeated checks that users must perform to ensure basic usability should enter product planning. The ability to take on these checks directly affects whether users can entrust a complete task to the system.

Dimensions, format, and product identifiers, for example, lend themselves to explicit rule-based checks. Product distortion requires more suitable evaluation methods. Brand style and aesthetic choices may still require user participation. Understanding these activities separately helps determine what the system should take on and how to establish that it does so reliably.

I do not expect all human judgment to disappear. Human choices can be an important part of a service. But users repeatedly patching gaps to maintain basic usability should be treated as a product problem to address. For a business already able to produce usable candidates, I would prioritize reducing this labor and assess improvements by the total investment needed to meet the same delivery requirements.

## First address what slows delivery

Once the whole process is in view, improvement priorities change.

Suppose a workflow continuously generates one thousand images per hour, every image requires human review, and review can handle only one hundred per hour. Even with no losses elsewhere, sustained delivery is capped at one hundred images per hour. Increasing actual generation speed makes the review backlog grow faster without increasing delivery speed.

This is deliberately simplified, but it leads me toward a clear choice: **engineering investment should follow the bottleneck in complete delivery.** When review already limits delivery volume, improving generation speed should not automatically come first.

In practice, the bottleneck may not remain at one stage. Incomplete input materials can stall tasks before they start. Frequent errors of a particular kind can consume time in repeated revisions. Judgments dependent on a few specialists can also limit progress. We need to see where tasks wait and why they are redone before choosing where to invest.

Two arrangements in [Toyota's explanation of its production system](https://global.toyota/en/company/vision-and-philosophy/production-system/) are worth considering together: stopping production when abnormalities are found to prevent further defects, and connecting stages according to the time and quantity needed. Borrowing this perspective, whether a stage should continue operating needs to be judged in the context of complete delivery.

If a particular type of packaging text is frequently altered incorrectly, pausing those tasks and clarifying the method's limits is a reasonable production action. Continuing to run the same problematic method in batches extends a known defect into more results requiring inspection and remediation.

For product choices, I would first address the most common and consequential blockers. If checking formats consumes substantial time, add rule-based validation. If the same kind of input repeatedly produces errors, correct the method or narrow the supported scope. If specialist judgment is indispensable, schedule batches and delivery around review capacity. Increase generation capacity when generation itself becomes the constraint and downstream stages can handle more results.

Model upgrades can also address these issues. A better-suited model that significantly reduces errors may reduce rework and review burdens together. But that benefit needs validation in the subsequent work; it cannot be inferred solely from generation speed or a single evaluation score.

## Retain processes that have been validated

If the activities above belong to production, what a product should retain over time becomes clearer.

I would treat a method that reliably completes a class of tasks as a product asset requiring maintenance. This includes the conditions inputs must meet, how work is organized, how results are accepted, and how particular exceptions are handled. We also need to know the conditions under which the method has been validated and where people still need to make judgments.

Saving a workflow diagram preserves the order of calls. But a process that runs still leaves much to establish before we know when we can rely on it.

ISA-88 in batch processing offers a useful reference. It describes product recipes separately from equipment control, allowing production methods and the equipment executing them to be managed separately. [Yokogawa's introduction to ISA-88 batch control](https://www.yokogawa.com/sg/library/resources/media-publications/standardizing-batch-control/) explains the purpose of this separation. For AI businesses, the lesson I draw is that methods for completing tasks deserve their own description and maintenance; they should not be entirely hidden in the details of one model call.

This separation does not make models freely interchangeable. With the same prompts and workflow, changing the model may require revalidating earlier quality judgments. Retaining the method helps identify which conditions changed and how far previous experience still applies.

Consider product images again. Suppose a process works for inputs with simple backgrounds and clear subjects but often struggles with text on reflective packaging. Repeated execution should leave a record of these limits, failure examples, and validated remedies. On encountering a similar task, the team can then decide whether to reuse the process, request additional materials, or hand the work to a person.

If these judgments remain in a few people's memories, every handover and new batch may incur the learning cost again. Once they are written back into the workflow, input requirements, and acceptance methods, solving one problem has a chance to improve many subsequent executions.

“Validated” matters here. Run records provide clues but do not automatically establish that a method is reliable. After adjusting a prompt, we still need to observe whether it reduces the target error, introduces new problems, or works only on a few examples. Successful examples, failures, and method versions should correspond so they can support later judgments.

Acceptance methods themselves also need checking. Format validation cannot detect errors in product structure, and a high score from a model needs comparison with actual acceptance results. The [NIST AI Risk Management Framework](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) considers evaluation under conditions resembling actual operation, validity, and continuous monitoring in production. My takeaway is that a conveniently measured score cannot simply serve as evidence that business requirements have been met.

I would therefore prioritize retaining this knowledge for processes used repeatedly, shared by multiple people, or affected by recurring defects. The starting point can be small: define the boundaries for one class of inputs, retain representative examples, and record how common exceptions are handled. When models, workflows, or acceptance requirements change, revalidate the affected parts. What needs to accumulate is evidence useful for the next decision.

For businesses already generating candidates consistently, I care more about whether the product is gradually mastering concrete methods for a class of deliveries. Model advances create new possibilities; accumulated process knowledge helps teams turn those possibilities into actual business use.

To plan the next stage of work, I would follow one batch of real tasks, identify where users perform the most remediation, where delivery waits longest, and where the same errors recur, then improve the most consequential issue. Under similar tasks and the same delivery requirements, I would check total investment and completion, retaining the methods that work.

The progress I hope to see is concrete: when similar tasks arrive again, the system can avoid last time's common defects, users perform one fewer round of repeated checks, and the team understands more clearly which exceptions require human help. Processes built around this progress are what I believe AI production has the most to learn from industry.
