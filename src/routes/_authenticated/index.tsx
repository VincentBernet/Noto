import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Textarea } from "flowbite-react";
import { Send } from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

const App = () => {
	const [question, setQuestion] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createConversation = useMutation(api.conversations.mutations.create);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!question.trim() || isSubmitting) return;

		setIsSubmitting(true);
		try {
			const conversationId = await createConversation({
				message: question.trim(),
			});
			console.log("Created conversation:", conversationId);
			setQuestion("");
		} catch (error) {
			console.error("Failed to create conversation:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="relative py-20 px-6 text-center overflow-hidden">
			<h1 className="text-4xl font-bold">Time to learn 📚</h1>
			<form
				onSubmit={handleSubmit}
				className="flex items-center justify-center gap-2 mt-4"
			>
				<Textarea
					rows={4}
					placeholder="Ask a question to Noto"
					onChange={(e) => setQuestion(e.target.value)}
					value={question}
					disabled={isSubmitting}
				/>
				<button
					type="submit"
					disabled={isSubmitting || !question.trim()}
					className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Send size={20} />
				</button>
			</form>
		</section>
	);
};

export const Route = createFileRoute("/_authenticated/")({
	component: App,
});
