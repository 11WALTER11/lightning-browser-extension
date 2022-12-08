import { CheckIcon } from "@bitcoin-design/bitcoin-icons-react/filled";
import ConfirmOrCancel from "@components/ConfirmOrCancel";
import Container from "@components/Container";
import PublisherCard from "@components/PublisherCard";
import Checkbox from "@components/form/Checkbox";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ScreenHeader from "~/app/components/ScreenHeader";
import { useNavigationState } from "~/app/hooks/useNavigationState";
import { USER_REJECTED_ERROR } from "~/common/constants";
import msg from "~/common/lib/msg";
import { OriginData } from "~/types";

function NostrConfirm() {
  const { t } = useTranslation("translation", {
    keyPrefix: "nostr",
  });
  const { t: tCommon } = useTranslation("common");
  const navState = useNavigationState();
  const origin = navState.origin as OriginData;
  const description = navState.args?.description;
  const details = navState.args?.details;
  const [loading, setLoading] = useState(false);
  const [rememberPermission, setRememberPermission] = useState(false);

  function confirm() {
    setLoading(true);
    msg.reply({
      confirm: true,
      rememberPermission,
    });
    setLoading(false);
  }

  function reject(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    msg.error(USER_REJECTED_ERROR);
  }

  async function block(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    await msg.request("addBlocklist", {
      domain: origin.domain,
      host: origin.host,
    });
    alert(`Added ${origin.host} to the blocklist, please reload the website`);
    msg.error(USER_REJECTED_ERROR);
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar">
      <ScreenHeader title={t("title")} />
      <Container justifyBetween maxWidth="sm">
        <div>
          <PublisherCard
            title={origin.name}
            image={origin.icon}
            url={origin.host}
            isSmall={false}
          />
          <div className="dark:text-white pt-6 mb-4">
            <p className="mb-2">{t("allow", { host: origin.host })}</p>
            <p className="dark:text-white">
              <CheckIcon className="w-5 h-5 mr-2 inline" />
              {description}
              {details && (
                <>
                  <br />
                  <i className="ml-7">{details}</i>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center">
            <Checkbox
              id="remember_permission"
              name="remember_permission"
              checked={rememberPermission}
              onChange={(event) => {
                setRememberPermission(event.target.checked);
              }}
            />
            <label
              htmlFor="remember_permission"
              className="cursor-pointer ml-2 block text-sm text-gray-900 font-medium dark:text-white"
            >
              {t("confirm_sign_message.remember.label")}
            </label>
          </div>
        </div>
        <div className="mb-4 text-center flex flex-col">
          <ConfirmOrCancel
            disabled={loading}
            loading={loading}
            label={tCommon("actions.confirm")}
            onConfirm={confirm}
            onCancel={reject}
          />
          <a
            className="underline text-sm text-gray-400 mx-4 overflow-hidden text-ellipsis whitespace-nowrap"
            href="#"
            onClick={block}
          >
            {t("block_and_ignore", { host: origin.host })}
          </a>
        </div>
      </Container>
    </div>
  );
}

export default NostrConfirm;
