'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@survey/ui/components/card';
import { Input } from '@survey/ui/components/input';
import { Label } from '@survey/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@survey/ui/components/select';

type QuestionType = 'multiple-choice' | 'short-answer';

interface QuestionBlockProps {
  index: number;
  initialQuestionText: string;
  initialType: QuestionType;
  initialOptions?: string[];
}

export function QuestionBlock({
  index,
  initialQuestionText,
  initialType,
  initialOptions = [],
}: QuestionBlockProps) {
  const [type, setType] = useState<QuestionType>(initialType);
  const questionId = `question-${index}`;
  const typeId = `question-type-${index}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Question {index}</CardTitle>
          <span className="text-xs text-muted-foreground">
            {type === 'multiple-choice' ? 'Multiple choice' : 'Short answer'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor={questionId}>Question text</Label>
          <Input
            id={questionId}
            defaultValue={initialQuestionText}
            placeholder="Enter your question…"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={typeId}>Question type</Label>
          <Select value={type} onValueChange={(v) => setType(v as QuestionType)}>
            <SelectTrigger id={typeId} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple-choice">Multiple choice</SelectItem>
              <SelectItem value="short-answer">Short answer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === 'multiple-choice' && initialOptions.length > 0 && (
          <div className="space-y-2">
            <Label>Answer options</Label>
            <div className="space-y-2">
              {initialOptions.map((option, i) => (
                <div key={option} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs text-muted-foreground shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <Input defaultValue={option} placeholder={`Option ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
