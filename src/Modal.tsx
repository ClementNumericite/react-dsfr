import React, { memo, forwardRef, type CSSProperties, type ReactNode } from "react";
import { fr } from "./fr";
import { cx } from "./tools/cx";
import { assert } from "tsafe/assert";
import { symToStr } from "tsafe/symToStr";
import type { Equals } from "tsafe";
import { createComponentI18nApi } from "./i18n";
import type { FrIconClassName, RiIconClassName } from "./fr/generatedFromCss/classNames";
import Button, { ButtonProps } from "./Button";
import { capitalize } from "tsafe/capitalize";
import { uncapitalize } from "tsafe/uncapitalize";

export type ModalProps = {
    className?: string;
    /** Default: "medium" */
    size?: "small" | "medium" | "large";
    title: ReactNode;
    children: ReactNode;
    /** Default: true */
    concealingBackdrop?: boolean;
    topAnchor?: boolean;
    iconId?: FrIconClassName | RiIconClassName;
    buttons?:
        | [ModalProps.ActionAreaButtonProps, ...ModalProps.ActionAreaButtonProps[]]
        | ModalProps.ActionAreaButtonProps;
    style?: CSSProperties;
};

export namespace ModalProps {
    export type ActionAreaButtonProps = ButtonProps & {
        /** Default: true */
        doClosesModal?: boolean;
    };
}

const Modal = memo(
    forwardRef<HTMLDialogElement, ModalProps & { id: string }>((props, ref) => {
        const {
            className,
            id,
            title,
            children,
            concealingBackdrop = true,
            topAnchor = false,
            iconId,
            buttons: buttons_props,
            size = "medium",
            style,
            ...rest
        } = props;

        assert<Equals<keyof typeof rest, never>>();

        const buttons =
            buttons_props === undefined
                ? undefined
                : buttons_props instanceof Array
                ? buttons_props
                : [buttons_props];

        const { t } = useTranslation();
const titleId= `fr-modal-title-${id}`;
        return (
            <dialog
                aria-labelledby={titleId}
                role="dialog"
                id={id}
                className={cx(fr.cx("fr-modal", topAnchor && "fr-modal--top"), className)}
                style={style}
                ref={ref}
                data-fr-concealing-backdrop={concealingBackdrop}
            >
                <div className={fr.cx("fr-container", "fr-container--fluid", "fr-container-md")}>
                    <div className={fr.cx("fr-grid-row", "fr-grid-row--center")}>
                        <div
                            className={(() => {
                                switch (size) {
                                    case "large":
                                        return fr.cx("fr-col-12", "fr-col-md-10", "fr-col-lg-8");
                                    case "small":
                                        return fr.cx("fr-col-12", "fr-col-md-6", "fr-col-lg-4");
                                    case "medium":
                                        return fr.cx("fr-col-12", "fr-col-md-8", "fr-col-lg-6");
                                }
                            })()}
                        >
                            <div className={fr.cx("fr-modal__body")}>
                                <div className={fr.cx("fr-modal__header")}>
                                    <button
                                        className={fr.cx("fr-link--close", "fr-link")}
                                        title={t("close")}
                                        aria-controls={id}
                                    >
                                        {t("close")}
                                    </button>
                                </div>
                                <div className={fr.cx("fr-modal__content")}>
                                    <h1
                                        id={`fr-modal-title-${id}`}
                                        className={fr.cx("fr-modal__title")}
                                    >
                                        {iconId !== undefined && (
                                            <span className={fr.cx(iconId, "fr-fi--lg")} />
                                        )}
                                        {title}
                                    </h1>
                                    {children}
                                </div>
                                {buttons !== undefined && (
                                    <div className="fr-modal__footer">
                                        <ul
                                            className={fr.cx(
                                                "fr-btns-group",
                                                "fr-btns-group--right",
                                                "fr-btns-group--inline-reverse",
                                                "fr-btns-group--inline-lg",
                                                "fr-btns-group--icon-left"
                                            )}
                                        >
                                            {[...buttons]
                                                .reverse()
                                                .map(
                                                    (
                                                        { doClosesModal = true, ...buttonProps },
                                                        i
                                                    ) => (
                                                        <li key={i}>
                                                            <Button
                                                                {...buttonProps}
                                                                priority={
                                                                    buttonProps.priority ??
                                                                    (i === 0
                                                                        ? "primary"
                                                                        : "secondary")
                                                                }
                                                                {...(!doClosesModal
                                                                    ? {}
                                                                    : "linkProps" in buttonProps
                                                                    ? {
                                                                          "linkProps": {
                                                                              ...buttonProps.linkProps,
                                                                              "aria-controls": id
                                                                          } as any
                                                                      }
                                                                    : {
                                                                          "nativeButtonProps": {
                                                                              ...buttonProps.nativeButtonProps,
                                                                              "aria-controls": id
                                                                          } as any
                                                                      })}
                                                            />
                                                        </li>
                                                    )
                                                )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
        );
    })
);

Modal.displayName = symToStr({ Modal });

const { useTranslation, addModalTranslations } = createComponentI18nApi({
    "componentName": symToStr({ Modal }),
    "frMessages": {
        "close": "Fermer"
    }
});

addModalTranslations({
    "lang": "en",
    "messages": {
        "close": "Close"
    }
});

addModalTranslations({
    "lang": "es",
    "messages": {
        /* spell-checker: disable */
        "close": "Cerrar"
        /* spell-checker: enable */
    }
});

export { addModalTranslations };

function createOpenModalButtonProps(params: { modalId: string; isOpenedByDefault: boolean }) {
    const { modalId, isOpenedByDefault } = params;

    return {
        //For RSC we don't want to pass an empty function.
        "onClick": undefined as any as () => void,
        "nativeButtonProps": {
            "aria-controls": modalId,
            "data-fr-opened": isOpenedByDefault
        }
    };
}

let counter = 0;

/** @see <https://react-dsfr-components.etalab.studio/?path=/docs/components-modal> */
export function createModal<Name extends string>(params: {
    name: Name;
    isOpenedByDefault: boolean;
}): Record<`${Uncapitalize<Name>}ModalButtonProps`, ReturnType<typeof createOpenModalButtonProps>> &
    Record<`${Capitalize<Name>}Modal`, (props: ModalProps) => JSX.Element> {
    const { name, isOpenedByDefault } = params;

    const modalId = `${uncapitalize(name)}-modal-${counter++}`;

    const openModalButtonProps = createOpenModalButtonProps({
        modalId,
        isOpenedByDefault
    });

    function InternalModal(props: ModalProps) {
        return (
            <>
                {isOpenedByDefault && (
                    <Button {...openModalButtonProps} className={fr.cx("fr-hidden")}>
                        {" "}
                    </Button>
                )}
                <Modal {...props} id={modalId} />
            </>
        );
    }

    InternalModal.displayName = `${capitalize(name)}Modal`;

    Object.defineProperty(InternalModal, "name", { "value": InternalModal.displayName });

    return {
        [InternalModal.displayName]: InternalModal,
        [`${uncapitalize(name)}ModalButtonProps`]: openModalButtonProps
    } as any;
}
